// Run: node --test plugins/finance/scripts/
const test = require('node:test');
const assert = require('node:assert');
const { compute, indexation, prevMonth } = require('./tax.js');

test('prevMonth: January wraps to December', () => {
  assert.strictEqual(prevMonth('2026-01-15'), '2025-12');
  assert.strictEqual(prevMonth('2026-11-20'), '2026-10');
});

test('USD loss can be a TL gain', () => {
  const out = compute({
    trades: [
      { type: 'buy', symbol: 'X', date: '2025-01-10', qty: 1, price_usd: 100 },
      { type: 'sell', symbol: 'X', date: '2025-12-10', qty: 1, price_usd: 95 },
    ],
    fx: { '2025-01-10': 40, '2025-12-10': 50 },
  });
  const s = out.sales[0];
  assert.strictEqual(s.gain_usd, -5);
  assert.strictEqual(s.gain_tl, 750); // 95*50 - 100*40
  assert.strictEqual(s.lots[0].indexation.applied, false); // no ÜFE given
});

test('ÜFE indexation applies at a 10% rise and lowers the gain', () => {
  const out = compute({
    trades: [
      { type: 'buy', symbol: 'X', date: '2025-01-10', qty: 1, price_usd: 100 },
      { type: 'sell', symbol: 'X', date: '2025-12-10', qty: 1, price_usd: 100 },
    ],
    fx: { '2025-01-10': 40, '2025-12-10': 50 },
    ufe: { '2025-01': 100, '2025-11': 120 },
  });
  const lot = out.sales[0].lots[0];
  assert.strictEqual(lot.indexation.applied, true);
  assert.strictEqual(lot.cost_used_tl, 4800);
  assert.strictEqual(out.sales[0].gain_tl, 200);
});

test('ÜFE rise under 10% is not applied', () => {
  const idx = indexation('2025-01-10', '2025-12-10', { '2025-01': 100, '2025-11': 109.9 });
  assert.strictEqual(idx.applied, false);
});

test('FIFO across lots, commissions included', () => {
  const out = compute({
    trades: [
      { type: 'buy', symbol: 'Q', date: '2025-01-02', qty: 1, price_usd: 100, fee_usd: 1 },
      { type: 'buy', symbol: 'Q', date: '2025-02-03', qty: 1, price_usd: 200, fee_usd: 1 },
      { type: 'sell', symbol: 'Q', date: '2025-03-03', qty: 1.5, price_usd: 300, fee_usd: 1.5 },
    ],
    fx: { '2025-01-02': 10, '2025-02-03': 10, '2025-03-03': 10 },
  });
  const [first, second] = out.sales[0].lots;
  assert.strictEqual(first.qty, 1);
  assert.strictEqual(first.cost_tl, 1010);
  assert.strictEqual(second.qty, 0.5);
  assert.strictEqual(second.cost_tl, 1005);
  // proceeds per unit 300 - 1 fee = 299
  assert.strictEqual(out.sales[0].gain_tl, 2990 + 1495 - 1010 - 1005);
  assert.deepStrictEqual(out.net_gain_tl_by_year, { 2025: 2470 });
});

test('selling more than bought is an error', () => {
  assert.throws(() => compute({
    trades: [{ type: 'sell', symbol: 'Q', date: '2025-01-02', qty: 1, price_usd: 1 }],
    fx: { '2025-01-02': 10 },
  }), /not enough bought/);
});

test('a missing rate is an error', () => {
  assert.throws(() => compute({ trades: [{ type: 'buy', symbol: 'Q', date: '2025-01-02', qty: 1, price_usd: 1 }], fx: {} }), /no rate/);
});
