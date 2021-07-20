// import { createSelector } from '@reduxjs/toolkit';
import { baraja, CardId, numPilas } from 'datos';
import { RootState } from 'store/store';
import { UndoStackEntry } from 'store/juegoSlice';
import { slotsArray } from 'utils';

export const selHasWon = (state: RootState): boolean => {
  return slotsArray(numPilas).every((slot) => {
    const pila = state.juego.pilas[slot];
    if (pila.length === 0) return false;
    const topCarta = baraja[pila[0]];
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
  for (let slot = 0; slot < numPilas; slot++) {
    const pila = state.juego.pilas[slot];
    if (pila.length) {
      const topCardId = pila[0];
      if (!topCardId) return false;
      const topCarta = baraja[topCardId];
      if (carta.palo === topCarta.palo && carta.index === topCarta.index + 1) {
        return slot;
      }
    } else {
      if (carta.index === 0) return slot;
    }
  }
  return false;
};

export const selCanUndo = (state: RootState): boolean => {
  return state.undo.current >= 0;
};
export const selCanRedo = (state: RootState): boolean => {
  const u = state.undo;
  return u.current < u.stack.length - 1;
};

export const selUndoAction = (state: RootState): UndoStackEntry => {
  const u = state.undo;
  return u.stack[u.current];
};

export const selRedoAction = (state: RootState): UndoStackEntry => {
  const u = state.undo;
  return u.stack[u.current + 1];
};
