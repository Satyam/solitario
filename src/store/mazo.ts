import { atom, selector } from 'recoil';
import { numCartas, numPalos, numValores, valores, palos } from 'datos';
import type { CardId } from 'datos';

export type mazoType = CardId[];

export const mazoState = atom<mazoType>({
  key: 'mazoState',
  default: [],
});

export const mazoSize = selector({
  key: 'mazoSize',
  get: ({ get }) => get(mazoState).length,
});

export const mazoTop = selector({
  key: 'mazoTop',
  get: ({ get }) => {
    const cartas = get(mazoState);
    return cartas[cartas.length - 1];
  },
});

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const mazoBarajar = selector<void>({
  key: 'mazoBarajar',
  get: () => void 0,
  set: ({ set }) => {
    const cartas: CardId[] = [];
    while (cartas.length < numCartas) {
      let p = getRandomInt(0, numPalos - 1);
      let v = getRandomInt(0, numValores - 1);
      const cardId = `${valores[v]}${palos[p]}` as CardId;
      if (!cartas.includes(cardId)) {
        cartas.push(cardId);
      }
    }
    set(mazoState, cartas);
  },
});
