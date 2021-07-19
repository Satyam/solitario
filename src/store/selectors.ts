// import { createSelector } from '@reduxjs/toolkit';
import { baraja, CardId, numPilas } from 'datos';
import { RootState } from 'store';
import { slotsArray } from 'utils';

export const isWon = (state: RootState): boolean => {
  return slotsArray(numPilas).every((slot) => {
    const cardIds = state.juego.pilas[slot];
    if (cardIds.length === 0) return false;
    const topCarta = baraja[cardIds[0]];
    if (topCarta.index !== 12) return false;
    return true;
  });
};

export const selPilaToSendCard = (
  state: RootState,
  cardId: CardId
): number | false => {
  const carta = baraja[cardId];
  if (!carta) return false;
  for (let slot = 0; slot < numPilas; slot++)
    if (state.juego.pilas[slot].length) {
      const topCardId = state.juego.pilas[slot][0];
      if (!topCardId) return false;
      const topCarta = baraja[topCardId];
      if (carta.palo === topCarta.palo && carta.index === topCarta.index + 1) {
        return slot;
      }
    } else {
      if (carta.index === 0) return slot;
    }
  return false;
};
