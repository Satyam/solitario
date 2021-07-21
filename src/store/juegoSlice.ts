import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import undoable, { ActionCreators as UndoActionCreators } from 'redux-undo';
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

const initNewGame = (): JuegoState => {
  const state: Partial<JuegoState> = {};
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
  return state as JuegoState;
};

export type UndoStackEntry = PayloadAction<jugada> | PayloadAction;

export const juegoSlice = createSlice({
  name: 'juego',
  initialState: initNewGame(),
  reducers: {
    newGameAction: () => initNewGame(),
    jugadaAction: (
      state: JuegoState,
      {
        payload: { fromPos, fromSlot, cardIds, toPos, toSlot },
      }: PayloadAction<jugada>
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
          break;
        case POS.MAZO:
          state.mazo.unshift(cardIds[0]);
          break;
        default:
          throw new Error(`Invalid toPos: ${toPos} on jugada`);
      }
    },
    restoreMazoAction: (state) => {
      state.mazo = state.vista.reverse();
      state.vista = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { newGameAction, jugadaAction, restoreMazoAction } =
  juegoSlice.actions;

export const { undo: undoAction, redo: redoAction } = UndoActionCreators;
export default undoable(juegoSlice.reducer);
