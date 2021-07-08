import { atom, selector } from 'recoil';
import type { CardId } from 'datos';

export type mazoType = {
  cartas: CardId[];
};

export const mazoState = atom<mazoType>({
  key: 'mazoState',
  default: {
    cartas: [],
  },
});

export const mazoSize = selector({
  key: 'mazoSize',
  get: ({ get }) => get(mazoState).cartas.length,
});
