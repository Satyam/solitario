import { datos, baraja, numHuecos, numPilas } from './datos.js';
// export const sleep = (ms: number) =>
//   new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
export function shuffle(a) {
  return a.sort(() => Math.random() - 0.5);
}
export function canDropInPila(fromCardId, toSlot) {
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
export function canDropInSomePila(fromCardId) {
  if (typeof fromCardId === 'undefined') return false;
  for (let toSlot = 0; toSlot < numPilas; toSlot++) {
    if (canDropInPila(fromCardId, toSlot)) return toSlot;
  }
  return false;
}
export function canDropInHueco(fromCardId, toSlot) {
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
export function canDropInSomeHueco(fromCardId) {
  if (typeof fromCardId === 'undefined') return false;
  for (let toSlot = 0; toSlot < numHuecos; toSlot++) {
    if (canDropInHueco(fromCardId, toSlot)) return toSlot;
  }
  return false;
}
export class ExecutionQueue {
  constructor() {
    this.q = Promise.resolve();
  }
  add(operation) {
    this.q = this.q.then(operation).catch(err => {
      console.error(err, operation.toString());
    });
  }
}

export function fireEV(EV) {
  document.dispatchEvent(new Event(EV));
}

export function onEV(EV, callback) {
  document.addEventListener(EV, callback);
}

export function offEV(EV, callback) {
  document.removeEventListener(EV, callback);
}
