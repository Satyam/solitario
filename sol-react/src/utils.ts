// export function getRandomInt(min: number, max?: number): number {
//   if (typeof max === 'undefined') {
//     return Math.floor(Math.random() * (min + 1));
//   }
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

export const slotsArray = (num: number): number[] =>
  Array(num)
    .fill(0)
    .map((_, i) => i);

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export function shuffle<T extends any[]>(a: T): T {
  return a.sort(() => Math.random() - 0.5);
}
