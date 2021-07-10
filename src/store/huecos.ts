import { atom } from 'recoil';
import type { CardId } from 'datos';
import memoize from 'nano-memoize';

export const huecoState = memoize((slot: number) =>
  atom<CardId[]>({
    key: `huecoState-${slot}`,
    default: [],
  })
);

export const lastHiddenState = memoize((slot: number) =>
  atom<number>({
    key: `lastHiddenState-${slot}`,
    default: 0,
  })
);
