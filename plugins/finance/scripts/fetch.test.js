// Run: node --test plugins/finance/scripts/
// Parser tests on saved samples (shapes seen from the live sources on 2026-11-21).
const test = require('node:test');
const assert = require('node:assert');
const { parseYahoo, parseTcmbXml, parseFredCsv, SourceError } = require('./fetch.js');

const yahooSample = {
  chart: {
    result: [{
      meta: { symbol: 'QQQ', currency: 'USD', longName: 'Invesco QQQ Trust', fullExchangeName: 'NasdaqGM' },
      timestamp: [1763560200, 1763646600, 1763733000],
      events: { dividends: { 1763560200: { amount: 0.75, date: 1763560200 } } },
      indicators: {
        quote: [{ close: [600, null, 608.45] }],
        adjclose: [{ adjclose: [599.2, null, 608.45] }],
      },
    }],
    error: null,
  },
};

test('parseYahoo: drops empty rows, keeps adjusted close and dividends', () => {
  const out = parseYahoo(yahooSample);
  assert.strictEqual(out.symbol, 'QQQ');
  assert.strictEqual(out.points.length, 2);
  assert.deepStrictEqual(out.points[0], { date: '2025-11-19', close: 600, adjclose: 599.2 });
  assert.deepStrictEqual(out.dividends, [{ date: '2025-11-19', amount: 0.75 }]);
});

test('parseYahoo: an error response is a SourceError', () => {
  assert.throws(() => parseYahoo({ chart: { result: null, error: { description: 'No data found' } } }), SourceError);
});

const tcmbSample = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="isokur.xsl"?>
<Tarih_Date Tarih="20.11.2026" Date="11/20/2026"  Bulten_No="2026/219" >
	<Currency CrossOrder="0" Kod="USD" CurrencyCode="USD">
			<Unit>1</Unit>
			<Isim>ABD DOLARI</Isim>
			<CurrencyName>US DOLLAR</CurrencyName>
			<ForexBuying>50.4028</ForexBuying>
			<ForexSelling>50.4936</ForexSelling>
			<BanknoteBuying>50.3675</BanknoteBuying>
			<BanknoteSelling>50.5694</BanknoteSelling>
				<CrossRateUSD/>
				<CrossRateOther/>
	</Currency>
	<Currency CrossOrder="1" Kod="AUD" CurrencyCode="AUD">
			<Unit>1</Unit>
			<ForexBuying>32.1</ForexBuying>
			<ForexSelling>32.3</ForexSelling>
			<BanknoteBuying></BanknoteBuying>
			<BanknoteSelling></BanknoteSelling>
	</Currency>
</Tarih_Date>`;

test('parseTcmbXml: USD rates and bulletin date', () => {
  const out = parseTcmbXml(tcmbSample);
  assert.strictEqual(out.date, '2026-11-20');
  assert.strictEqual(out.bulletin, '2026/219');
  assert.strictEqual(out.forex_buying, 50.4028);
  assert.strictEqual(out.forex_selling, 50.4936);
});

test('parseTcmbXml: empty fields are null, other currencies work', () => {
  const out = parseTcmbXml(tcmbSample, 'AUD');
  assert.strictEqual(out.forex_buying, 32.1);
  assert.strictEqual(out.banknote_buying, null);
});

test('parseTcmbXml: missing currency is a SourceError', () => {
  assert.throws(() => parseTcmbXml(tcmbSample, 'XYZ'), SourceError);
});

test('parseFredCsv: skips missing values', () => {
  const rows = parseFredCsv('observation_date,DGS3MO\n2026-11-18,4.35\n2026-11-19,\n2026-11-20,4.34\n');
  assert.deepStrictEqual(rows, [{ date: '2026-11-18', value: 4.35 }, { date: '2026-11-20', value: 4.34 }]);
});

test('parseFredCsv: an HTML page is a SourceError', () => {
  assert.throws(() => parseFredCsv('<html>blocked</html>'), SourceError);
});
