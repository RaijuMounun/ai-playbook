// Run: node --test plugins/finance/scripts/
const test = require('node:test');
const assert = require('node:assert');
const m = require('./metrics.js');

// Business-day-ish series: one point per calendar day keeps the date math simple.
function series(values, start = '2020-01-01') {
  const t0 = new Date(`${start}T00:00:00Z`).getTime();
  return values.map((value, i) => ({ date: new Date(t0 + i * 86400000).toISOString().slice(0, 10), value }));
}

test('maxDrawdown: depth, dates and recovery', () => {
  const s = series([100, 120, 90, 60, 80, 121, 130]);
  const dd = m.maxDrawdown(s);
  assert.strictEqual(dd.depth_pct, -50);
  assert.strictEqual(dd.peak_date, '2020-01-02');
  assert.strictEqual(dd.trough_date, '2020-01-04');
  assert.strictEqual(dd.recovery_date, '2020-01-06');
  assert.strictEqual(dd.recovery_days, 2);
});

test('maxDrawdown: not recovered', () => {
  const dd = m.maxDrawdown(series([100, 80, 90]));
  assert.strictEqual(dd.depth_pct, -20);
  assert.strictEqual(dd.recovery_date, null);
});

test('maxDrawdown: a rising series has no drawdown', () => {
  assert.strictEqual(m.maxDrawdown(series([1, 2, 3])).depth_pct, 0);
});

test('rolling: window returns, worst, best, share positive', () => {
  const r = m.rolling(series([100, 110, 99, 120]), 1);
  assert.strictEqual(r.periods, 3);
  assert.strictEqual(r.worst_pct, -10);
  assert.strictEqual(r.best_pct, 21.21);
  assert.strictEqual(r.positive_share_pct, 66.67);
});

test('rolling: too short a history gives null', () => {
  assert.strictEqual(m.rolling(series([1, 2]), 5), null);
});

test('cagr: doubling over 2 years', () => {
  const s = [{ date: '2020-01-01', value: 1 }, { date: '2022-01-01', value: 2 }];
  assert.ok(Math.abs(m.cagr(s) - (Math.SQRT2 - 1)) < 0.001);
});

test('riskReturn: constant growth has zero volatility', () => {
  const s = series(Array.from({ length: 50 }, (_, i) => 100 * 1.001 ** i));
  assert.ok(m.riskReturn(s).vol < 1e-9);
});

test('movingAverageGap: price 10% above a flat average', () => {
  const s = series([...Array(199).fill(100), 120]);
  assert.ok(Math.abs(m.movingAverageGap(s) - 120 / 100.1 + 1) < 1e-9);
});

test('movingAverageGap: under 200 points gives null', () => {
  assert.strictEqual(m.movingAverageGap(series([1, 2, 3])), null);
});

test('correlation: identical moves are 1, opposite moves are -1 (daily and weekly)', () => {
  const up = Array.from({ length: 40 }, (_, i) => 100 + 10 * Math.sin(i / 3));
  const a = series(up);
  const b = series(up.map((v) => v / 2));
  const c = series(up.map((v) => 300 - v));
  assert.strictEqual(m.correlation(a, b).correlation_daily, 1);
  assert.strictEqual(m.correlation(a, b).correlation_weekly, 1);
  assert.ok(m.correlation(a, c).correlation_daily < -0.99);
  assert.ok(m.correlation(a, c).correlation_weekly < -0.99);
});

test('correlation: a one-day lag hides co-movement daily but not weekly', () => {
  const base = Array.from({ length: 120 }, (_, i) => 100 + 5 * Math.sin(i / 7) + (i % 3));
  const a = series(base);
  const lagged = series([base[0], ...base.slice(0, -1)]);
  const out = m.correlation(a, lagged);
  assert.ok(out.correlation_weekly > out.correlation_daily);
});

test('joinForward: carries the last FX rate over gaps', () => {
  const usd = series([10, 11, 12]);
  const fx = [{ date: '2020-01-01', value: 5 }, { date: '2020-01-03', value: 6 }];
  assert.deepStrictEqual(m.joinForward(usd, fx).map((p) => p.b), [5, 5, 6]);
});

test('analyse: TL return combines USD return and USD/TRY change', () => {
  const usd = [{ date: '2020-01-01', value: 100 }, { date: '2021-01-01', value: 95 }];
  const fx = [{ date: '2020-01-01', value: 40 }, { date: '2021-01-01', value: 50 }];
  const out = m.analyse({ usd, usdtry: fx, trInflation: 0.3 });
  assert.strictEqual(out.usd.total_return_pct, -5);
  assert.strictEqual(out.tl.total_return_pct, 18.75); // 0.95 * 1.25 - 1
  assert.ok(out.tl.real_yearly_return_pct < 0); // 18.75% does not beat 30% inflation
  assert.ok(out.limits.some((l) => l.includes('under 3 years')));
});

test('cpiYearly: 10% over one year', () => {
  const cpi = [{ date: '2020-01-01', value: 100 }, { date: '2021-01-01', value: 110 }];
  assert.ok(Math.abs(m.cpiYearly(cpi, '2020-01-15') - 0.1) < 0.001);
});
