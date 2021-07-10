import { atom } from 'recoil';
import type { CardId } from 'datos';
import memoize from 'nano-memoize';

export const pilaState = memoize((slot: number) =>
  atom<CardId[]>({
    key: `pilaState-${slot}`,
    default: [],
  })
);
