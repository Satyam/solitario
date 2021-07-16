import { atomFamily } from 'recoil';
import type { CardId } from 'datos';

export const pilaState = atomFamily<CardId[], number>({
  key: 'pilaState',
  default: [],
});
