import { atom, selector } from 'recoil';
import { numCartas, numPalos, numValores, valores, palos } from 'datos';
import { getRandomInt } from 'utils';
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
    return get(mazoState)[0];
  },
});

export const mazoBarajar = selector<void>({
  key: 'mazoBarajar',
  get: () => void 0,
  set: ({ set }) => {
    const cardIds: CardId[] = [];
    while (cardIds.length < numCartas) {
      let p = getRandomInt(numPalos - 1);
      let v = getRandomInt(numValores - 1);
      const cardId = `${valores[v]}${palos[p]}` as CardId;
      if (!cardIds.includes(cardId)) {
        cardIds.push(cardId);
      }
    }
    set(mazoState, cardIds);
  },
});
