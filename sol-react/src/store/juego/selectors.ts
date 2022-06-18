import { createSelector } from '@reduxjs/toolkit';
import { baraja, tCardId, numPilas } from 'datos';
import type { tRootState } from 'store/types';
import { slotsArray } from 'utils';

const selPresentJuego = (state: tRootState) => state.juego.present;
const selSlot = (_: tRootState, slot: number) => slot;

export const selCanUndo = (state: tRootState): boolean =>
  state.juego.past.length > 0;
export const selCanRedo = (state: tRootState): boolean =>
  state.juego.future.length > 0;

export const selMazo = createSelector(selPresentJuego, (juego) => juego.mazo);
export const selVista = createSelector(selPresentJuego, (juego) => juego.vista);

export const selHueco = createSelector(
  selPresentJuego,
  selSlot,
  (juego, slot) => juego.huecos[slot]
);

export const selPila = createSelector(
  selPresentJuego,
  selSlot,
  (juego, slot) => juego.pilas[slot]
);

const selPilas = (state: tRootState) => state.juego.present.pilas;

export const selHasWon = createSelector(selPilas, (pilas) =>
  slotsArray(numPilas).every((slot) => {
    const pila = pilas[slot];
    if (pila.length === 0) return false;
    const topCarta = baraja[pila[0]];
    if (topCarta.index !== 12) return false;
    return true;
  })
);

export const selPilaToSendCard = createSelector(
  selPilas,
  (_: tRootState, cardId: tCardId) => baraja[cardId],
  (pilas, carta) => {
    if (!carta) return false;
    for (let slot = 0; slot < numPilas; slot++) {
      const pila = pilas[slot];
      if (pila.length) {
        const topCardId = pila[0];
        if (!topCardId) return false;
        const topCarta = baraja[topCardId];
        if (
          carta.palo === topCarta.palo &&
          carta.index === topCarta.index + 1
        ) {
          return slot;
        }
      } else {
        if (carta.index === 0) return slot;
      }
    }
    return false;
  }
);
