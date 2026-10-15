import test from 'node:test';
import assert from 'node:assert/strict';
import { createSession, generateNumber, cleanDigits, formatDigits, spokenNumber, frenchNumber } from '../numbers.js';
test('sessions contain ten French domestic mobile-format numbers', () => {
  for (let session = 0; session < 100; session++) {
    const numbers = createSession();
    assert.equal(numbers.length, 10);
    for (const number of numbers) assert.match(number, /^0[67]\d{8}$/);
  }
  assert.equal(generateNumber(() => 0), '0600000000');
  assert.equal(generateNumber(() => .9999), '0799999999');
});
test('input accepts ten digits including leading zero, formatting pairs progressively', () => {
  assert.equal(cleanDigits('abc06 12 34 56 78 extra 123'), '0612345678');
  assert.equal(formatDigits('0612345678'), '06 12 34 56 78');
  assert.equal(formatDigits('06123'), '06 12 3');
  assert.equal(formatDigits('0'), '0');
  assert.equal(formatDigits(''), '');
});
test('speech pronounces five pairs with leading zeroes', () => {
  assert.equal(spokenNumber('0612345678'), 'zéro six. douze. trente-quatre. cinquante-six. soixante-dix-huit.');
  assert.equal(spokenNumber('0700010209'), 'zéro sept. zéro zéro. zéro un. zéro deux. zéro neuf.');
});
test('French pair pronunciation covers irregular tens and conjunctions', () => {
  const examples = { 17:'dix-sept', 20:'vingt', 21:'vingt et un', 61:'soixante et un', 70:'soixante-dix', 71:'soixante et onze', 72:'soixante-douze', 79:'soixante-dix-neuf', 80:'quatre-vingts', 81:'quatre-vingt-un', 90:'quatre-vingt-dix', 91:'quatre-vingt-onze', 99:'quatre-vingt-dix-neuf' };
  for (const [value, expected] of Object.entries(examples)) assert.equal(frenchNumber(Number(value)), expected);
  for (let n=0; n<100; n++) assert.ok(frenchNumber(n) && !frenchNumber(n).includes('undefined'));
});
