import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CardId,
  numCartas,
  numPalos,
  numValores,
  valores,
  palos,
  numPilas,
  numHuecos,
  jugada,
  POS,
} from 'datos';

import { slotsArray, getRandomInt } from 'utils';

export interface JuegoState {
  mazo: CardId[];
  vista: CardId[];
  pilas: CardId[][];
  huecos: {
    cardIds: CardId[];
    firstShown: number;
  }[];
}

const initialState: JuegoState = {
  mazo: [],
  vista: [],
  pilas: slotsArray(numPilas).map(() => []),
  huecos: slotsArray(numHuecos).map(() => ({
    cardIds: [],
    firstShown: 0,
  })),
};

export const counterSlice = createSlice({
  name: 'juego',
  initialState,
  reducers: {
    newGameAction: (state) => {
      state.pilas = slotsArray(numPilas).map(() => []);
      state.vista = [];

      const cardIds: CardId[] = [];
      // Shuffle (get an array of unique cards)
      while (cardIds.length < numCartas) {
        let p = getRandomInt(numPalos - 1);
        let v = getRandomInt(numValores - 1);
        const cardId = `${valores[v]}${palos[p]}` as CardId;
        if (!cardIds.includes(cardId)) {
          cardIds.push(cardId);
        }
      }

      state.huecos = slotsArray(numHuecos).map((slot) => ({
        // splice returns the array of elements deleted from the array
        cardIds: cardIds.splice(0, slot + 1),
        firstShown: slot,
      }));

      // Place the remaining cards in the mazo.
      state.mazo = cardIds;
    },
    jugadaAction: (
      state,
      {
        payload: { fromPos, fromSlot, cardIds, toPos, toSlot },
      }: PayloadAction<jugada>
    ) => {
      switch (fromPos) {
        case POS.PILA:
          if (cardIds[0] !== state.pilas[fromSlot][0]) {
            console.error(
              'source pilas do not match',
              fromSlot,
              cardIds,
              state.pilas[fromSlot]
            );
          }
          state.pilas[fromSlot].shift();
          break;
        case POS.VISTA:
          if (cardIds[0] !== state.vista[0]) {
            console.error('source vista do not match', cardIds, state.vista);
          }
          state.vista.shift();
          break;
        case POS.MAZO:
          if (cardIds[0] !== state.mazo[0]) {
            console.error('source mazo do not match', cardIds, state.mazo);
          }
          state.mazo.shift();
          break;

        case POS.HUECO:
          {
            const h = state.huecos[fromSlot];
            if (!cardIds.every((c, i) => c === h.cardIds[i])) {
              console.error(
                'source hueco do not match',
                fromSlot,
                cardIds,
                h.cardIds
              );
            }
            h.cardIds.splice(0, cardIds.length);
            if (h.firstShown >= h.cardIds.length) {
              h.firstShown = h.cardIds.length - 1;
            }
          }
          break;
        default:
          throw new Error(`Invalid fromPos: ${fromPos} on jugada`);
      }
      switch (toPos) {
        case POS.PILA:
          state.pilas[toSlot].unshift(...cardIds);
          break;
        case POS.VISTA:
          state.vista.unshift(cardIds[0]);
          break;
        case POS.HUECO:
          state.huecos[toSlot].cardIds.unshift(...cardIds);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { newGameAction, jugadaAction } = counterSlice.actions;

export default counterSlice.reducer;
