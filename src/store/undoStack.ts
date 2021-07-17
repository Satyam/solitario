import { atom, selector } from 'recoil';
import { CardId, numHuecos, numPilas } from 'datos';
import { mazoState } from './mazo';
import { vistaState } from './vista';
import { slotsArray } from 'utils';
import { huecoState, firstShownState } from './huecos';
import { pilaState } from './pilas';

type SavedState = {
  mazo: CardId[];
  pilas: CardId[][];
  huecos: CardId[][];
  firstShown: number[];
  vista: CardId[];
};

export const undoStack = atom<SavedState[]>({
  key: 'undoStack',
  default: [],
});

export const canUndo = selector<boolean>({
  key: 'canUndo',
  get: ({ get }) => get(undoStack).length > 1,
});

//TODO https://github.com/facebookexperimental/Recoil/issues/451#issuecomment-655243901
export const saveState = selector<boolean>({
  key: 'saveState',
  get: () => false,
  set: ({ get, set }, init) => {
    const newState: Partial<SavedState> = {};
    const storedStates = init ? [] : get(undoStack);
    const lastState = storedStates[0] || {};

    const currentMazo = get(mazoState) || [];
    if (
      typeof lastState.mazo === 'undefined' ||
      currentMazo[0] !== lastState.mazo[0]
    ) {
      newState.mazo = currentMazo;
    } else {
      newState.mazo = lastState.mazo;
    }

    const currentVista = get(vistaState) || [];
    if (
      typeof lastState.vista === 'undefined' ||
      currentVista[0] !== lastState.vista[0]
    ) {
      newState.vista = currentVista;
    } else {
      newState.vista = lastState.vista;
    }

    slotsArray(numHuecos).forEach((slot) => {
      const currentHueco = get(huecoState(slot)) || [];
      if (typeof newState.huecos === 'undefined') newState.huecos = [];
      if (
        typeof lastState.huecos === 'undefined' ||
        currentHueco[0] !== lastState.huecos[slot][0]
      ) {
        newState.huecos[slot] = currentHueco;
      } else {
        newState.huecos[slot] = lastState.huecos[slot];
      }

      const currentFirstShown = get(firstShownState(slot)) || 0;
      if (typeof newState.firstShown === 'undefined') newState.firstShown = [];
      if (
        typeof lastState.firstShown === 'undefined' ||
        currentFirstShown !== lastState.firstShown[slot]
      ) {
        newState.firstShown[slot] = currentFirstShown;
      } else {
        newState.firstShown[slot] = lastState.firstShown[slot];
      }
    });

    slotsArray(numPilas).forEach((slot) => {
      const currentPila = get(pilaState(slot)) || [];
      if (typeof newState.pilas === 'undefined') newState.pilas = [];
      if (
        typeof lastState.pilas === 'undefined' ||
        currentPila[0] !== lastState.pilas[slot][0]
      ) {
        newState.pilas[slot] = currentPila;
      } else {
        newState.pilas[slot] = lastState.pilas[slot];
      }
    });

    set(undoStack, [newState as SavedState, ...storedStates]);
  },
});

export const undoAction = selector({
  key: 'undoAction',
  get: () => undefined,
  set: ({ get, set }) => {
    const [, lastState, ...prevStates] = get(undoStack);
    set(mazoState, lastState.mazo);
    set(vistaState, lastState.vista);
    slotsArray(numHuecos).forEach((slot) => {
      set(huecoState(slot), lastState.huecos[slot]);
      set(firstShownState(slot), lastState.firstShown[slot]);
    });
    slotsArray(numPilas).forEach((slot) => {
      set(pilaState(slot), lastState.pilas[slot]);
    });
    set(undoStack, [lastState, ...prevStates]);
  },
});
