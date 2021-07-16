import { atomFamily } from 'recoil';
import type { CardId } from 'datos';

export const huecoState = atomFamily<CardId[], number>({
  key: 'huecoState',
  default: [],
});

export const firstShownState = atomFamily<number, number>({
  key: 'firstShownState',
  default: 0,
});
