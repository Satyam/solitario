import { datos, tCardId, baraja, numHuecos, numPilas } from './datos.js';

// export const sleep = (ms: number) =>
//   new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export function shuffle<T extends any[]>(a: T): T {
  return a.sort(() => Math.random() - 0.5);
}

export type tCanDrop = number | false;

export function canDropInPila(fromCardId: tCardId, toSlot: number) {
  const fromCarta = baraja[fromCardId];
  const toCardId = datos.pilas[toSlot][0];
  if (toCardId) {
    const toCarta = baraja[toCardId];
    return (
      fromCarta.palo === toCarta.palo && fromCarta.index === toCarta.index + 1
    );
  } else {
    return fromCarta.valor === 'A';
  }
}

export function canDropInSomePila(fromCardId: tCardId): tCanDrop {
  if (typeof fromCardId === 'undefined') return false;
  for (let toSlot = 0; toSlot < numPilas; toSlot++) {
    if (canDropInPila(fromCardId, toSlot)) return toSlot;
  }
  return false;
}

export function canDropInHueco(fromCardId: tCardId, toSlot: number) {
  const fromCarta = baraja[fromCardId];
  const toCardId = datos.huecos[toSlot][0];
  if (toCardId) {
    const toCarta = baraja[toCardId];
    return (
      fromCarta.color !== toCarta.color && fromCarta.index === toCarta.index - 1
    );
  } else {
    return fromCarta.valor === 'K';
  }
}

export function canDropInSomeHueco(fromCardId: tCardId): tCanDrop {
  if (typeof fromCardId === 'undefined') return false;
  for (let toSlot = 0; toSlot < numHuecos; toSlot++) {
    if (canDropInHueco(fromCardId, toSlot)) return toSlot;
  }
  return false;
}

export class ExecutionQueue {
  q: Promise<void>;
  constructor() {
    this.q = Promise.resolve();
  }
  add(operation: () => Promise<any> | any) {
    this.q = this.q.then(operation).catch((err) => {
      console.error(err, operation.toString());
    });
  }
}
