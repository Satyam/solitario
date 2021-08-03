import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import undoable, {
  ActionCreators as UndoActionCreators,
  excludeAction,
} from 'redux-undo';

import { tCardId, numPilas, numHuecos, POS, baraja } from 'datos';

import { tJugada, tJuegoState } from './types';

import { slotsArray, shuffle } from 'utils';

const initNewGame = (): tJuegoState => {
  const state: Partial<tJuegoState> = {};
  state.pilas = slotsArray(numPilas).map(() => []);
  state.vista = [];

  const cardIds = shuffle<tCardId[]>(Object.keys(baraja) as tCardId[]);

  state.huecos = slotsArray(numHuecos).map((slot) => ({
    // splice returns the array of elements deleted from the array
    cardIds: cardIds.splice(0, slot + 1),
    firstShown: slot,
  }));

  // Place the remaining cards in the mazo.
  state.mazo = cardIds;

  return state as tJuegoState;
};

const juegoSlice = createSlice({
  name: 'juego',
  initialState: initNewGame(),
  reducers: {
    newGameAction: () => initNewGame(),
    takeFrom: (
      state: tJuegoState,
      { payload: { fromPos, fromSlot, cardIds } }: PayloadAction<tJugada>
    ) => {
      switch (fromPos) {
        case POS.PILA:
          state.pilas[fromSlot].shift();
          break;
        case POS.VISTA:
          state.vista.shift();
          break;
        case POS.MAZO:
          state.mazo.shift();
          break;

        case POS.HUECO:
          {
            const h = state.huecos[fromSlot];
            h.cardIds.splice(0, cardIds.length);
            if (h.firstShown >= h.cardIds.length) {
              h.firstShown = h.cardIds.length - 1;
            }
          }
          break;
        default:
          throw new Error(`Invalid fromPos: ${fromPos} on tJugada`);
      }
    },
    putInto: (
      state: tJuegoState,
      { payload: { cardIds, toPos, toSlot } }: PayloadAction<tJugada>
    ) => {
      switch (toPos) {
        case POS.PILA:
          state.pilas[toSlot].unshift(...cardIds);
          break;
        case POS.VISTA:
          state.vista.unshift(cardIds[0]);
          break;
        case POS.HUECO:
          state.huecos[toSlot].cardIds.unshift(...cardIds);
          break;
        case POS.MAZO:
          state.mazo.unshift(cardIds[0]);
          break;
        default:
          throw new Error(`Invalid toPos: ${toPos} on tJugada`);
      }
    },
    restoreMazoAction: (state) => {
      state.mazo = state.vista.reverse();
      state.vista = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { newGameAction, restoreMazoAction, takeFrom, putInto } =
  juegoSlice.actions;

export const {
  undo: undoAction,
  redo: redoAction,
  clearHistory: clearUndoAction,
} = UndoActionCreators;

export const reducer = undoable(juegoSlice.reducer, {
  filter: excludeAction(takeFrom.type),
});
