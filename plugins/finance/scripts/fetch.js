#!/usr/bin/env node
// Live market data for finance-coach. Prints one JSON object with the source URL and the
// as-of date of the last data point. Nothing is cached: FRED's terms forbid storing its
// data, and prices go stale anyway.
//
// Usage: node fetch.js <command> ...
//   prices <SYM...> [--years N]    Daily close, adjusted close and dividends from the Yahoo
//                                  chart API (unofficial, keyless). TRY=X is USD/TRY.
//   fx-tcmb <YYYY-MM-DD> [--currency USD]
//                                  Official TCMB indicative rate on a date. On a weekend or
//                                  holiday, the last bulletin before it (up to 10 days back).
//   cpi-us                         US CPI (CPIAUCSL, monthly) from FRED, keyless CSV.
//   tbill-us                       Latest 3-month US Treasury bill yield (DGS3MO) from FRED.
//
// Exit code 2 means the source was unreachable or changed: fall back to the researcher.

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

class SourceError extends Error {}

async function get(url) {
  let res;
  try {
    res = await fetch(url, { headers: { 'User-Agent': UA } });
  } catch (e) {
    throw new SourceError(`${url}: ${e.cause?.code || e.message}`);
  }
  if (res.status === 404) return { status: 404, text: '' };
  if (!res.ok) throw new SourceError(`${url}: HTTP ${res.status}`);
  return { status: res.status, text: await res.text() };
}

const isoDate = (unixSeconds) => new Date(unixSeconds * 1000).toISOString().slice(0, 10);

// --- parsers (exported for tests) ---

function parseYahoo(json) {
  const result = json?.chart?.result?.[0];
  if (!result || !Array.isArray(result.timestamp)) {
    throw new SourceError(`Yahoo: unexpected response (${json?.chart?.error?.description || 'no result'})`);
  }
  const quote = result.indicators?.quote?.[0] || {};
  const adj = result.indicators?.adjclose?.[0]?.adjclose || [];
  const points = [];
  result.timestamp.forEach((t, i) => {
    const close = quote.close?.[i];
    if (close == null) return; // holidays and partial rows
    points.push({ date: isoDate(t), close, adjclose: adj[i] ?? close });
  });
  const dividends = Object.values(result.events?.dividends || {})
    .map((d) => ({ date: isoDate(d.date), amount: d.amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return {
    symbol: result.meta?.symbol,
    name: result.meta?.longName || result.meta?.shortName,
    currency: result.meta?.currency,
    exchange: result.meta?.fullExchangeName,
    points,
    dividends,
  };
}

function parseTcmbXml(xml, currency = 'USD') {
  const head = xml.match(/<Tarih_Date[^>]*\bDate="(\d{2})\/(\d{2})\/(\d{4})"[^>]*Bulten_No="([^"]+)"/);
  if (!head) throw new SourceError('TCMB: no Tarih_Date header');
  const block = xml.match(new RegExp(`<Currency[^>]*\\bKod="${currency}"[^>]*>([\\s\\S]*?)</Currency>`));
  if (!block) throw new SourceError(`TCMB: no ${currency} in bulletin`);
  const field = (name) => {
    const m = block[1].match(new RegExp(`<${name}>([^<]*)</${name}>`));
    return m && m[1].trim() !== '' ? Number(m[1]) : null;
  };
  return {
    date: `${head[3]}-${head[1]}-${head[2]}`,
    bulletin: head[4],
    currency,
    unit: field('Unit'),
    forex_buying: field('ForexBuying'),
    forex_selling: field('ForexSelling'),
    banknote_buying: field('BanknoteBuying'),
    banknote_selling: field('BanknoteSelling'),
  };
}

function parseFredCsv(csv) {
  const rows = csv.trim().split(/\r?\n/);
  if (!/^observation_date,|^DATE,/.test(rows[0])) throw new SourceError('FRED: unexpected header');
  return rows.slice(1)
    .map((line) => line.split(','))
    .filter(([, v]) => v !== '' && v !== '.' && v !== undefined)
    .map(([date, v]) => ({ date, value: Number(v) }));
}

// --- commands ---

async function prices(symbols, years = 10) {
  const now = Math.floor(Date.now() / 1000);
  const from = now - Math.round(years * 365.25 * 86400);
  const out = [];
  for (const sym of symbols) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?period1=${from}&period2=${now}&interval=1d&events=div`;
    const { text } = await get(url);
    let json;
    try { json = JSON.parse(text); } catch { throw new SourceError(`Yahoo ${sym}: not JSON`); }
    const data = parseYahoo(json);
    out.push({ ...data, source: url.replace(/period1=\d+&period2=\d+&/, ''), as_of: data.points.at(-1)?.date });
  }
  return out;
}

async function fxTcmb(date, currency = 'USD') {
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error(`bad date "${date}"`);
  for (let back = 0; back <= 10; back += 1) {
    const day = new Date(d.getTime() - back * 86400000);
    const y = day.getUTCFullYear();
    const m = String(day.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(day.getUTCDate()).padStart(2, '0');
    const url = `https://www.tcmb.gov.tr/kurlar/${y}${m}/${dd}${m}${y}.xml`;
    const { status, text } = await get(url);
    if (status === 404) continue;
    return { requested_date: date, ...parseTcmbXml(text, currency), source: url };
  }
  throw new SourceError(`TCMB: no bulletin within 10 days before ${date}`);
}

async function fred(series) {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${series}`;
  const { text } = await get(url);
  const rows = parseFredCsv(text);
  return { series, source: url, as_of: rows.at(-1)?.date, rows };
}

async function run(argv) {
  const [command, ...rest] = argv;
  const flag = (name, fallback) => {
    const i = rest.indexOf(`--${name}`);
    return i >= 0 ? rest[i + 1] : fallback;
  };
  const positional = rest.filter((a, i) => !a.startsWith('--') && !(i > 0 && rest[i - 1].startsWith('--')));
  switch (command) {
    case 'prices':
      if (!positional.length) throw new Error('prices needs at least one symbol');
      return prices(positional, Number(flag('years', 10)));
    case 'fx-tcmb':
      if (!positional[0]) throw new Error('fx-tcmb needs a date YYYY-MM-DD');
      return fxTcmb(positional[0], flag('currency', 'USD'));
    case 'cpi-us':
      return fred('CPIAUCSL');
    case 'tbill-us': {
      const data = await fred('DGS3MO');
      return { series: data.series, source: data.source, as_of: data.as_of, yield_pct: data.rows.at(-1)?.value };
    }
    default:
      throw new Error(`unknown command "${command}"; use prices, fx-tcmb, cpi-us or tbill-us`);
  }
}

module.exports = { parseYahoo, parseTcmbXml, parseFredCsv, prices, fxTcmb, fred, run, SourceError };

if (require.main === module) {
  run(process.argv.slice(2))
    .then((out) => process.stdout.write(`${JSON.stringify(out)}\n`))
    .catch((e) => {
      process.stderr.write(`fetch.js: ${e.message}\n`);
      process.exit(e instanceof SourceError ? 2 : 1);
    });
}
