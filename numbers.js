// Assigned geographic NANP area codes. Fictional 555-0100–0199 subscriber
// numbers are reserved for entertainment, avoiding real people's numbers.
export const AREA_CODES = [212, 213, 310, 312, 415, 617, 646, 202, 206, 305, 404, 512, 702, 808, 917];
export function generateNumber(random = Math.random) {
  const area = AREA_CODES[Math.floor(random() * AREA_CODES.length)];
  return `${area}55501${String(Math.floor(random() * 100)).padStart(2, '0')}`;
}
export function createSession(random = Math.random) {
  return Array.from({ length: 10 }, () => generateNumber(random));
}
export function cleanDigits(value) { return value.replace(/\D/g, '').slice(0, 10); }
export function formatDigits(value) {
  return [value.slice(0, 3), value.slice(3, 6), value.slice(6, 10)].filter(Boolean).join('-');
}
const words = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
export function spokenNumber(number) {
  return `Plus un. ${[number.slice(0, 3), number.slice(3, 6), number.slice(6)].map(group => [...group].map(digit => words[Number(digit)]).join(', ')).join('. ')}.`;
}
