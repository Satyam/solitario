import { atomFamily, selector } from 'recoil';
import { CardId, baraja, numPilas } from 'datos';

export const pilaState = atomFamily<CardId[], number>({
  key: 'pilaState',
  default: [],
});

export const isGameWon = selector({
  key: 'isGameWon',
  get: ({ get }) => {
    for (let slot = 0; slot < numPilas; slot++) {
      const cardIds = get(pilaState(slot));
      if (cardIds.length === 0) return false;
      const topCarta = baraja[cardIds[0]];
      if (topCarta.index !== 12) return false;
    }
    return true;
  },
});
