#!/usr/bin/env node
// Taxable gain (değer artışı) in TL on sales of foreign-listed securities, for a Turkish
// resident. Matches sales to buys first-in-first-out, converts each side at the TCMB USD
// buying rate of its own date, and indexes the cost by Yİ-ÜFE when the index rose 10% or
// more (GVK mükerrer 81: the month before the sale against the purchase month).
// It does not compute the final tax: the bracket depends on the user's other income.
//
// Usage: node tax.js <input.json>
// {
//   "trades": [ { "type": "buy"|"sell", "symbol": "QQQ", "date": "YYYY-MM-DD",
//                 "qty": 1.5, "price_usd": 400, "fee_usd": 1.5 } ],
//   "ufe": { "YYYY-MM": 1234.56 },          // Yİ-ÜFE index values (needed months only)
//   "fx":  { "YYYY-MM-DD": 34.12 }          // optional; missing dates are fetched from TCMB
// }

const fs = require('fs');

const round = (x) => Math.round(x * 100) / 100;
const month = (date) => date.slice(0, 7);
const prevMonth = (date) => {
  const [y, m] = date.split('-').map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
};

function indexation(buyDate, sellDate, ufe) {
  const from = ufe?.[month(buyDate)];
  const to = ufe?.[prevMonth(sellDate)];
  if (from == null || to == null) {
    return { applied: false, ratio: null, note: `Yİ-ÜFE for ${month(buyDate)} and ${prevMonth(sellDate)} needed` };
  }
  const rise = to / from - 1;
  return { applied: rise >= 0.1, ratio: to / from, rise_pct: round(rise * 100), from_month: month(buyDate), to_month: prevMonth(sellDate) };
}

// fx: { date: rate } must hold every trade date (the CLI fills it from TCMB).
function compute({ trades, ufe = {}, fx }) {
  const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));
  const lots = {}; // symbol -> [{date, qty, price_usd, fee_per_unit_usd}]
  const sales = [];

  for (const t of sorted) {
    const rate = fx[t.date];
    if (rate == null) throw new Error(`no rate for ${t.date}`);
    const sym = t.symbol || '?';
    lots[sym] = lots[sym] || [];
    if (t.type === 'buy') {
      lots[sym].push({ date: t.date, qty: t.qty, price_usd: t.price_usd, fee_per_unit_usd: (t.fee_usd || 0) / t.qty });
      continue;
    }
    if (t.type !== 'sell') throw new Error(`trade type must be buy or sell, got "${t.type}"`);

    let remaining = t.qty;
    const sellFeePerUnit = (t.fee_usd || 0) / t.qty;
    const matched = [];
    while (remaining > 1e-9) {
      const lot = lots[sym][0];
      if (!lot) throw new Error(`${sym}: selling ${t.qty} on ${t.date} but not enough bought before it`);
      const qty = Math.min(lot.qty, remaining);
      const costTl = qty * (lot.price_usd + lot.fee_per_unit_usd) * fx[lot.date];
      const idx = indexation(lot.date, t.date, ufe);
      const costUsed = idx.applied ? costTl * idx.ratio : costTl;
      const proceedsTl = qty * (t.price_usd - sellFeePerUnit) * rate;
      matched.push({
        buy_date: lot.date,
        qty,
        buy_rate: fx[lot.date],
        cost_tl: round(costTl),
        indexation: idx,
        cost_used_tl: round(costUsed),
        proceeds_tl: round(proceedsTl),
        gain_tl: round(proceedsTl - costUsed),
        gain_usd: round(qty * (t.price_usd - sellFeePerUnit - lot.price_usd - lot.fee_per_unit_usd)),
      });
      lot.qty -= qty;
      remaining -= qty;
      if (lot.qty <= 1e-9) lots[sym].shift();
    }
    sales.push({
      symbol: sym,
      sell_date: t.date,
      qty: t.qty,
      sell_rate: rate,
      lots: matched,
      gain_tl: round(matched.reduce((a, m) => a + m.gain_tl, 0)),
      gain_usd: round(matched.reduce((a, m) => a + m.gain_usd, 0)),
    });
  }

  const byYear = {};
  for (const s of sales) {
    const y = s.sell_date.slice(0, 4);
    byYear[y] = round((byYear[y] || 0) + s.gain_tl);
  }
  return {
    sales,
    net_gain_tl_by_year: byYear,
    method: 'FIFO; cost and proceeds at the TCMB USD buying rate of each date; cost indexed by Yİ-ÜFE when the rise from the purchase month to the month before the sale is 10% or more; commissions included.',
    note: 'Losses offset gains on foreign securities in the same year only. The final tax depends on the progressive tariff and other income: declare on the annual return (March); a mali müşavir for large or unusual cases.',
  };
}

async function run(argv) {
  if (!argv[0]) throw new Error('give the input JSON file');
  const input = JSON.parse(fs.readFileSync(argv[0], 'utf8'));
  const fx = { ...(input.fx || {}) };
  const missing = [...new Set(input.trades.map((t) => t.date))].filter((d) => fx[d] == null);
  if (missing.length) {
    const { fxTcmb } = require('./fetch.js');
    for (const d of missing) fx[d] = (await fxTcmb(d, 'USD')).forex_buying;
  }
  return { ...compute({ ...input, fx }), fx_used: fx };
}

module.exports = { compute, indexation, prevMonth };

if (require.main === module) {
  run(process.argv.slice(2))
    .then((out) => process.stdout.write(`${JSON.stringify(out, null, 2)}\n`))
    .catch((e) => {
      process.stderr.write(`tax.js: ${e.message}\n`);
      process.exit(1);
    });
}
