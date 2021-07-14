import { atom, DefaultValue, selector } from 'recoil';
import type { CardId } from 'datos';

export const vistaState = atom<CardId[]>({ key: 'vistaState', default: [] });

export const vistaTop = selector<CardId>({
  key: 'vistaTop',
  get: ({ get }) => get(vistaState)[0],
});

export const vistaPush = selector<CardId[]>({
  key: 'vistaPush',
  get: ({ get }) => get(vistaState),
  set: ({ set }, cardIds) =>
    set(vistaState, (prev) =>
      cardIds instanceof DefaultValue ? prev : [...cardIds, ...prev]
    ),
});
