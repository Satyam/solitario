export function getRandomInt(min: number, max?: number): number {
  if (typeof max === 'undefined') {
    return Math.floor(Math.random() * (min + 1));
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}