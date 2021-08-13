import { tCardId } from './datos.js';

export const slotsArray = (num: number): number[] =>
  Array(num)
    .fill(0)
    .map((_, i) => i);

// export const sleep = (ms: number) =>
//   new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export function shuffle<T extends any[]>(a: T): T {
  return a.sort(() => Math.random() - 0.5);
}

export const imgSrc = (cardId: tCardId): string => `assets/cards/${cardId}.svg`;

export const cardImg = (cardId: tCardId, className: string = ''): string =>
  `<img  draggable="false" class="card ${className}" src="${imgSrc(cardId)}"/>`;
