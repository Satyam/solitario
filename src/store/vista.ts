import { atom, selector } from 'recoil';
import type { CardId } from 'datos';

export type vistaType = CardId[];

export const vistaState = atom<vistaType>({ key: 'vistaState', default: [] });

export const vistaTop = selector({
  key: 'vistaTop',
  get: ({ get }) => {
    return get(vistaState)[0];
  },
});
