import { atom } from 'recoil';
import type { CardId } from 'datos';
import memoize from 'nano-memoize';

export const huecoState = memoize((slot: number) =>
  atom<CardId[]>({
    key: `huecoState-${slot}`,
    default: [],
  })
);

export const firstShownState = memoize((slot: number) =>
  atom<number>({
    key: `firstShownState-${slot}`,
    default: 0,
  })
);
