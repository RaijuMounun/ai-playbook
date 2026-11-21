#!/usr/bin/env node
// Descriptive risk and return metrics for ETFs, in USD and in TL. No signals: the 200-day
// average is reported as context only.
//
// Usage: node metrics.js <SYM...> [--years N] [--tr-inflation <yearly %>]
//   Fetches prices (Yahoo), USD/TRY (Yahoo TRY=X), US CPI and the 3-month T-bill (FRED)
//   through fetch.js and prints one JSON object. Exit code 2: a source failed.

const { prices, fred, SourceError } = require('./fetch.js');

const TRADING_DAYS = 252;

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const stdev = (xs) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
};
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};
const r2 = (x) => (x == null || Number.isNaN(x) ? null : Math.round(x * 100) / 100);
const pct = (x) => r2(x * 100);
const yearsBetween = (a, b) => (new Date(b) - new Date(a)) / (365.25 * 86400000);
const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

// series: [{date, value}] sorted by date
function dailyReturns(series) {
  const out = [];
  for (let i = 1; i < series.length; i += 1) out.push(series[i].value / series[i - 1].value - 1);
  return out;
}

function maxDrawdown(series) {
  let peak = series[0];
  let worst = { depth: 0, peak: series[0].date, trough: series[0].date, peakValue: series[0].value };
  for (const p of series) {
    if (p.value > peak.value) peak = p;
    const depth = p.value / peak.value - 1;
    if (depth < worst.depth) worst = { depth, peak: peak.date, trough: p.date, peakValue: peak.value };
  }
  const after = series.find((p) => p.date > worst.trough && p.value >= worst.peakValue);
  return {
    depth_pct: pct(worst.depth),
    peak_date: worst.peak,
    trough_date: worst.trough,
    recovery_date: after ? after.date : null,
    recovery_days: after ? dayDiff(worst.trough, after.date) : null,
  };
}

function rolling(series, window) {
  if (series.length <= window) return null;
  const rets = [];
  for (let i = window; i < series.length; i += 1) rets.push(series[i].value / series[i - window].value - 1);
  return {
    periods: rets.length,
    worst_pct: pct(Math.min(...rets)),
    median_pct: pct(median(rets)),
    best_pct: pct(Math.max(...rets)),
    positive_share_pct: pct(rets.filter((r) => r > 0).length / rets.length),
  };
}

function cagr(series) {
  const years = yearsBetween(series[0].date, series.at(-1).date);
  return (series.at(-1).value / series[0].value) ** (1 / years) - 1;
}

function riskReturn(series, riskFreeYearly = 0) {
  const rets = dailyReturns(series);
  const rfDaily = (1 + riskFreeYearly) ** (1 / TRADING_DAYS) - 1;
  const excess = rets.map((r) => r - rfDaily);
  const vol = stdev(rets) * Math.sqrt(TRADING_DAYS);
  const downside = Math.sqrt(mean(excess.map((e) => Math.min(e, 0) ** 2))) * Math.sqrt(TRADING_DAYS);
  const annExcess = mean(excess) * TRADING_DAYS;
  return { vol, sharpe: annExcess / vol, sortino: downside === 0 ? null : annExcess / downside };
}

function movingAverageGap(series, n = 200) {
  if (series.length < n) return null;
  const avg = mean(series.slice(-n).map((p) => p.value));
  return series.at(-1).value / avg - 1;
}

// Joins two series by date, carrying the last known value of `b` forward.
function joinForward(a, b) {
  const out = [];
  let j = 0;
  let last = null;
  for (const p of a) {
    while (j < b.length && b[j].date <= p.date) { last = b[j].value; j += 1; }
    if (last != null) out.push({ date: p.date, a: p.value, b: last });
  }
  return out;
}

// Last value of each week (weeks start on Monday), keyed by the Monday's date.
function weekly(series) {
  const byWeek = new Map();
  for (const p of series) {
    const d = new Date(`${p.date}T00:00:00Z`);
    const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000).toISOString().slice(0, 10);
    byWeek.set(monday, { date: monday, value: p.value });
  }
  return [...byWeek.values()];
}

function pearson(ra, rb) {
  const ma = mean(ra);
  const mb = mean(rb);
  let cov = 0;
  let va = 0;
  let vb = 0;
  for (let i = 0; i < ra.length; i += 1) {
    cov += (ra[i] - ma) * (rb[i] - mb);
    va += (ra[i] - ma) ** 2;
    vb += (rb[i] - mb) ** 2;
  }
  return Math.round((cov / Math.sqrt(va * vb)) * 1000) / 1000;
}

function alignedReturns(sa, sb) {
  const mapB = new Map(sb.map((p) => [p.date, p.value]));
  const common = sa.filter((p) => mapB.has(p.date));
  return {
    n: common.length,
    ra: dailyReturns(common),
    rb: dailyReturns(common.map((p) => ({ date: p.date, value: mapB.get(p.date) }))),
  };
}

// Weekly returns are the headline: funds listed on exchanges that close at different
// hours (New York vs London) look less correlated day by day than they are.
function correlation(sa, sb) {
  const daily = alignedReturns(sa, sb);
  const wk = alignedReturns(weekly(sa), weekly(sb));
  return {
    correlation_weekly: wk.ra.length > 2 ? pearson(wk.ra, wk.rb) : null,
    correlation_daily: pearson(daily.ra, daily.rb),
    common_weeks: wk.n,
  };
}

// CPI growth between the month of `from` and the latest month with data.
function cpiYearly(cpiRows, from) {
  const startMonth = `${from.slice(0, 7)}-01`;
  const start = cpiRows.find((r) => r.date >= startMonth);
  const end = cpiRows.at(-1);
  if (!start || start === end) return null;
  return (end.value / start.value) ** (1 / yearsBetween(start.date, end.date)) - 1;
}

function analyse({ usd, usdtry, riskFree = 0, usCpiYearly = null, trInflation = null }) {
  const usdCagr = cagr(usd);
  const usdRR = riskReturn(usd, riskFree);
  const out = {
    period: `${usd[0].date}..${usd.at(-1).date}`,
    years: r2(yearsBetween(usd[0].date, usd.at(-1).date)),
    usd: {
      total_return_pct: pct(usd.at(-1).value / usd[0].value - 1),
      yearly_return_pct: pct(usdCagr),
      real_yearly_return_pct: usCpiYearly == null ? null : pct((1 + usdCagr) / (1 + usCpiYearly) - 1),
      volatility_pct: pct(usdRR.vol),
      max_drawdown: maxDrawdown(usd),
      rolling_1y: rolling(usd, TRADING_DAYS),
      rolling_3y: rolling(usd, TRADING_DAYS * 3),
      sharpe: r2(usdRR.sharpe),
      sortino: r2(usdRR.sortino),
      return_over_max_drawdown: null,
    },
    vs_200_day_average_pct: pct(movingAverageGap(usd)),
  };
  out.usd.return_over_max_drawdown = out.usd.max_drawdown.depth_pct
    ? r2(usdCagr / Math.abs(out.usd.max_drawdown.depth_pct / 100)) : null;

  if (usdtry && usdtry.length) {
    const tl = joinForward(usd, usdtry).map((p) => ({ date: p.date, value: p.a * p.b }));
    const tlCagr = cagr(tl);
    out.tl = {
      total_return_pct: pct(tl.at(-1).value / tl[0].value - 1),
      yearly_return_pct: pct(tlCagr),
      real_yearly_return_pct: trInflation == null ? null : pct((1 + tlCagr) / (1 + trInflation) - 1),
      volatility_pct: pct(riskReturn(tl).vol),
      max_drawdown: maxDrawdown(tl),
      rolling_1y: rolling(tl, TRADING_DAYS),
    };
  }

  const limits = [];
  if (out.years < 3) limits.push('History under 3 years: drawdown and rolling figures may miss a full market cycle.');
  limits.push('Sharpe and Sortino assume roughly normal, independent returns; real returns are not.');
  limits.push('Adjusted close includes reinvested dividends before tax; withholding on dividends lowers the real figure.');
  if (trInflation == null) limits.push('No Turkish inflation given: TL real return not computed.');
  out.limits = limits;
  return out;
}

const toSeries = (points, key = 'adjclose') => points.map((p) => ({ date: p.date, value: p[key] }));

async function run(argv) {
  const flag = (name) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? Number(String(argv[i + 1]).replace(',', '.')) : undefined;
  };
  const symbols = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--')));
  if (!symbols.length) throw new Error('give at least one symbol');
  const years = flag('years') ?? 10;
  const trInflation = flag('tr-inflation');

  const [funds, [fx], cpi, tbill] = await Promise.all([
    prices(symbols, years),
    prices(['TRY=X'], years),
    fred('CPIAUCSL'),
    fred('DGS3MO'),
  ]);
  const riskFree = (tbill.rows.at(-1)?.value ?? 0) / 100;
  const usdtry = toSeries(fx.points, 'close');

  const results = funds.map((f) => {
    const usd = toSeries(f.points);
    return {
      symbol: f.symbol,
      name: f.name,
      currency: f.currency,
      ...analyse({
        usd,
        usdtry: f.currency === 'USD' ? usdtry : null,
        riskFree,
        usCpiYearly: cpiYearly(cpi.rows, usd[0].date),
        trInflation: trInflation == null ? null : trInflation / 100,
      }),
    };
  });

  const correlations = [];
  for (let i = 0; i < funds.length; i += 1) {
    for (let j = i + 1; j < funds.length; j += 1) {
      correlations.push({ pair: [funds[i].symbol, funds[j].symbol], ...correlation(toSeries(funds[i].points), toSeries(funds[j].points)) });
    }
  }

  return {
    results,
    correlations,
    inputs: {
      risk_free_pct: r2(riskFree * 100),
      risk_free_source: `${tbill.source} (as of ${tbill.as_of})`,
      us_cpi_source: `${cpi.source} (as of ${cpi.as_of})`,
      usdtry_source: `${fx.source} (as of ${fx.as_of})`,
      prices_source: funds.map((f) => `${f.source} (as of ${f.as_of})`),
      tr_inflation_pct: trInflation ?? null,
    },
  };
}

module.exports = { maxDrawdown, rolling, cagr, riskReturn, movingAverageGap, correlation, joinForward, cpiYearly, analyse, dailyReturns };

if (require.main === module) {
  run(process.argv.slice(2))
    .then((out) => process.stdout.write(`${JSON.stringify(out, null, 2)}\n`))
    .catch((e) => {
      process.stderr.write(`metrics.js: ${e.message}\n`);
      process.exit(e instanceof SourceError ? 2 : 1);
    });
}
