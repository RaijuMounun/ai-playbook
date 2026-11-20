// Run: node --test plugins/finance/scripts/scenario.test.js
const test = require('node:test');
const assert = require('node:assert');
const { run } = require('./scenario.js');

const r = (...argv) => run(argv).results;

test('deposit: 365 days at 40% with 15% stopaj nets 34%', () => {
  const out = r('deposit', '--rate', '40', '--days', '365', '--stopaj', '15', '--inflation', '30');
  assert.strictEqual(out.term_gross_pct, 40);
  assert.strictEqual(out.term_net_pct, 34);
  assert.strictEqual(out.term_inflation_pct, 30);
  assert.strictEqual(out.term_real_pct, 3.08); // 1.34 / 1.30 - 1
});

test('deposit: short term compounds when annualised', () => {
  const out = r('deposit', '--rate', '36.5', '--days', '100', '--stopaj', '0');
  assert.strictEqual(out.term_net_pct, 10);
  assert.ok(out.net_yearly_compounded_pct > 36.5);
});

test('real: Fisher, not subtraction', () => {
  assert.strictEqual(r('real', '--nominal', '50', '--inflation', '45').real_yearly_pct, 3.45);
});

test('fund: doubling in 2 years is 41.42% a year', () => {
  assert.strictEqual(r('fund', '--start', '1', '--end', '2', '--years', '2').yearly_pct, 41.42);
});

test('fund: stopaj only on gains', () => {
  const out = r('fund', '--start', '100', '--end', '90', '--years', '1', '--stopaj', '15');
  assert.strictEqual(out.total_after_stopaj_pct, -10);
});

test('feedrag: a 2% fee over 10 years at 0% return costs about 18%', () => {
  const out = r('feedrag', '--amount', '100000', '--return', '0', '--fee', '2', '--years', '10');
  assert.strictEqual(out.fee_cost_share_pct, 18.29);
});

test('growth: zero rate is plain saving', () => {
  const out = r('growth', '--amount', '1000', '--monthly', '100', '--rate', '0', '--years', '1');
  assert.strictEqual(out.future_value, 2200);
});

test('goal: zero rate, 1000 a month to 12000 takes 12 months', () => {
  assert.strictEqual(r('goal', '--target', '12000', '--amount', '0', '--monthly', '1000', '--rate', '0').months, 12);
});

test('debt: payment below interest never pays off', () => {
  assert.strictEqual(r('debt', '--balance', '30000', '--rate', '4', '--payment', '1000').months, null);
});

test('debt: no interest, 3 payments', () => {
  const out = r('debt', '--balance', '3000', '--rate', '0', '--payment', '1000');
  assert.strictEqual(out.months, 3);
  assert.strictEqual(out.total_interest, 0);
});

test('comma decimals are accepted', () => {
  assert.strictEqual(r('real', '--nominal', '10,0', '--inflation', '0').real_yearly_pct, 10);
});

test('missing argument is an error', () => {
  assert.throws(() => run(['deposit', '--rate', '40']), /missing/);
});
