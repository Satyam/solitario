import { datos } from './datos.js';

// export const sleep = (ms: number) =>
//   new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export function shuffle<T extends any[]>(a: T): T {
  return a.sort(() => Math.random() - 0.5);
}

export function fixFirstShown(slot: number) {
  const lastCardIndex = datos.huecos[slot].length - 1;
  if (datos.firstShown[slot] > lastCardIndex) {
    datos.firstShown[slot] = lastCardIndex;
  }
}
