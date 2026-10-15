// French domestic mobile format: 06 or 07 followed by eight digits.
// These are practice numbers; do not call them.
export function generateNumber(random = Math.random) {
  const prefix = random() < .5 ? '06' : '07';
  return prefix + Array.from({ length: 4 }, () => String(Math.floor(random() * 100)).padStart(2, '0')).join('');
}
export function createSession(random = Math.random) {
  return Array.from({ length: 10 }, () => generateNumber(random));
}
export function cleanDigits(value) { return value.replace(/\D/g, '').slice(0, 10); }
export function formatDigits(value) {
  return (value.match(/.{1,2}/g) || []).join(' ');
}
const small = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
export function frenchNumber(value) {
  if (value < 17) return small[value];
  if (value < 20) return `dix-${small[value - 10]}`;
  if (value < 70) {
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'][Math.floor(value / 10)];
    const units = value % 10;
    return tens + (units === 0 ? '' : units === 1 ? ' et un' : `-${small[units]}`);
  }
  if (value < 80) return value === 71 ? 'soixante et onze' : `soixante-${frenchNumber(value - 60)}`;
  if (value === 80) return 'quatre-vingts';
  return `quatre-vingt-${frenchNumber(value - 80)}`;
}
export function spokenNumber(number) {
  return number.match(/\d{2}/g).map(pair => pair[0] === '0'
    ? `zéro ${small[Number(pair[1])]}`
    : frenchNumber(Number(pair))).join('. ') + '.';
}
