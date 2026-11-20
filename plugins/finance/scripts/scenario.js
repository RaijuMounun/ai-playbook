#!/usr/bin/env node
// Deterministic finance arithmetic for finance-coach. All rates are percentages
// (45 means 45%). Prints one JSON object with the inputs and the results, so the
// answer can show both.
//
// Usage: node scenario.js <command> --key value ...
//   deposit  --rate <yearly simple %> --days <n> --stopaj <%> [--inflation <yearly %>]
//            Term deposit: gross and net return for the term, net yearly compounded, real return.
//   fund     --start <price> --end <price> --years <n> [--stopaj <%>] [--inflation <yearly %>]
//            Fund price change (TEFAS prices are already net of fees): total, yearly, real.
//   real     --nominal <yearly %> --inflation <yearly %>
//            Real yearly rate (Fisher).
//   feedrag  --amount <TL> --return <yearly % before fee> --fee <yearly %> --years <n>
//            What a yearly fee costs over the horizon.
//   growth   --amount <TL> --monthly <TL> --rate <yearly %> --years <n>
//            Future value with monthly contributions, monthly compounding.
//   goal     --target <TL> --amount <TL> --monthly <TL> --rate <yearly %>
//            Months until the target is reached.
//   debt     --balance <TL> --rate <monthly %> --payment <TL per month>
//            Months to pay off and total interest (credit card or loan, no new spending).

function parse(argv) {
  const [command, ...rest] = argv;
  const args = {};
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i].replace(/^--/, '');
    const value = Number(String(rest[i + 1]).replace(',', '.'));
    if (Number.isNaN(value)) throw new Error(`--${key} needs a number, got "${rest[i + 1]}"`);
    args[key] = value;
  }
  return { command, args };
}

function need(args, keys) {
  const missing = keys.filter((k) => args[k] === undefined);
  if (missing.length) throw new Error(`missing: ${missing.map((k) => `--${k}`).join(' ')}`);
}

const pct = (x) => x / 100;
const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
const asPct = (x) => round(x * 100);

const commands = {
  deposit(a) {
    need(a, ['rate', 'days', 'stopaj']);
    const gross = pct(a.rate) * a.days / 365;
    const net = gross * (1 - pct(a.stopaj));
    const netYearly = (1 + net) ** (365 / a.days) - 1;
    const out = { term_gross_pct: asPct(gross), term_net_pct: asPct(net), net_yearly_compounded_pct: asPct(netYearly) };
    if (a.inflation !== undefined) {
      const termInflation = (1 + pct(a.inflation)) ** (a.days / 365) - 1;
      out.term_inflation_pct = asPct(termInflation);
      out.term_real_pct = asPct((1 + net) / (1 + termInflation) - 1);
      out.real_yearly_pct = asPct((1 + netYearly) / (1 + pct(a.inflation)) - 1);
    }
    return out;
  },
  fund(a) {
    need(a, ['start', 'end', 'years']);
    let total = a.end / a.start - 1;
    const out = { total_pct: asPct(total) };
    if (a.stopaj !== undefined) {
      total = total > 0 ? total * (1 - pct(a.stopaj)) : total;
      out.total_after_stopaj_pct = asPct(total);
    }
    const yearly = (1 + total) ** (1 / a.years) - 1;
    out.yearly_pct = asPct(yearly);
    if (a.inflation !== undefined) out.real_yearly_pct = asPct((1 + yearly) / (1 + pct(a.inflation)) - 1);
    return out;
  },
  real(a) {
    need(a, ['nominal', 'inflation']);
    return { real_yearly_pct: asPct((1 + pct(a.nominal)) / (1 + pct(a.inflation)) - 1) };
  },
  feedrag(a) {
    need(a, ['amount', 'return', 'fee', 'years']);
    const before = a.amount * (1 + pct(a.return)) ** a.years;
    const after = a.amount * ((1 + pct(a.return)) * (1 - pct(a.fee))) ** a.years;
    return { value_without_fee: round(before), value_with_fee: round(after), fee_cost: round(before - after), fee_cost_share_pct: asPct((before - after) / before) };
  },
  growth(a) {
    need(a, ['amount', 'monthly', 'rate', 'years']);
    const r = (1 + pct(a.rate)) ** (1 / 12) - 1;
    const n = Math.round(a.years * 12);
    const fv = a.amount * (1 + r) ** n + (r === 0 ? a.monthly * n : a.monthly * (((1 + r) ** n - 1) / r));
    const paidIn = a.amount + a.monthly * n;
    return { future_value: round(fv), paid_in: round(paidIn), growth: round(fv - paidIn) };
  },
  goal(a) {
    need(a, ['target', 'amount', 'monthly', 'rate']);
    const r = (1 + pct(a.rate)) ** (1 / 12) - 1;
    let value = a.amount;
    let months = 0;
    while (value < a.target) {
      if (months >= 1200) return { months: null, note: 'target not reached within 100 years' };
      value = value * (1 + r) + a.monthly;
      months += 1;
    }
    return { months, years: round(months / 12, 1), value_at_target: round(value) };
  },
  debt(a) {
    need(a, ['balance', 'rate', 'payment']);
    const r = pct(a.rate);
    if (a.payment <= a.balance * r) return { months: null, note: 'payment does not cover the monthly interest; the debt grows' };
    let balance = a.balance;
    let interest = 0;
    let months = 0;
    while (balance > 0.005) {
      const i = balance * r;
      interest += i;
      balance = balance + i - a.payment;
      months += 1;
    }
    return { months, total_interest: round(interest), total_paid: round(a.balance + interest) };
  },
};

function run(argv) {
  const { command, args } = parse(argv);
  if (!commands[command]) throw new Error(`unknown command "${command}"; use one of: ${Object.keys(commands).join(', ')}`);
  return { command, inputs: args, results: commands[command](args) };
}

module.exports = { run };

if (require.main === module) {
  try {
    process.stdout.write(`${JSON.stringify(run(process.argv.slice(2)), null, 2)}\n`);
  } catch (e) {
    process.stderr.write(`scenario.js: ${e.message}\n`);
    process.exit(1);
  }
}
