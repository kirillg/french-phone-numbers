import test from 'node:test';
import assert from 'node:assert/strict';
import { AREA_CODES, createSession, generateNumber, cleanDigits, formatDigits, spokenNumber } from '../numbers.js';
test('sessions contain ten valid reserved US numbers', () => {
  for (let session = 0; session < 100; session++) {
    const numbers = createSession();
    assert.equal(numbers.length, 10);
    for (const number of numbers) {
      assert.match(number, /^[2-9]\d{2}55501\d{2}$/);
      assert.ok(AREA_CODES.includes(Number(number.slice(0, 3))));
    }
  }
  assert.equal(generateNumber(() => 0), '2125550100');
  assert.equal(generateNumber(() => .9999), '9175550199');
});
test('input accepts only ten digits and formats progressive input', () => {
  assert.equal(cleanDigits('abc212-555-0199 extra 123'), '2125550199');
  assert.equal(formatDigits('2125550199'), '212-555-0199');
  assert.equal(formatDigits('2125'), '212-5');
});
test('French speech includes country code and every digit in order', () => {
  assert.equal(spokenNumber('2125550199'), 'Plus un. deux, un, deux. cinq, cinq, cinq. zéro, un, neuf, neuf.');
});
