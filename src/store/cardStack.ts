import { atom } from 'recoil';
import type { CardId } from 'datos';

export type cardStackType = CardId[];

export const cardStackState = atom<cardStackType>({
  key: 'cardStackState',
  default: ['2H', '3H', '4C', '5D'],
});

export const lastHiddenState = atom<number>({
  key: 'lastHiddenState',
  default: 2,
});
