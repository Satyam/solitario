import { atom, selector } from 'recoil';
import { CardId, numHuecos, numPilas } from 'datos';
import { mazoState } from './mazo';
import { vistaState } from './vista';
import { slotsArray } from 'utils';
import { huecoState } from './huecos';
import { pilaState } from './pilas';

type MySnapshot = {
  mazo: CardId[];
  pilas: CardId[][];
  huecos: CardId[][];
  vista: CardId[];
};

export const snapshots = atom<MySnapshot[]>({
  key: 'snapshots',
  default: [],
});

//TODO https://github.com/facebookexperimental/Recoil/issues/451#issuecomment-655243901
export const saveSnapshot = selector<boolean>({
  key: 'saveSnapshot',
  get: () => false,
  set: ({ get, set }, init) => {
    const newSnapshot: Partial<MySnapshot> = {};
    const storedSnaps = get(snapshots);
    const lastSnap = storedSnaps[0] || {};

    const currentMazo = get(mazoState) || [];
    if (
      init ||
      typeof lastSnap.mazo === 'undefined' ||
      currentMazo[0] !== lastSnap.mazo[0]
    ) {
      newSnapshot.mazo = currentMazo;
    } else {
      newSnapshot.mazo = lastSnap.mazo;
    }

    const currentVista = get(vistaState) || [];
    if (
      init ||
      typeof lastSnap.vista === 'undefined' ||
      currentVista[0] !== lastSnap.vista[0]
    ) {
      newSnapshot.vista = currentVista;
    } else {
      newSnapshot.vista = lastSnap.vista;
    }

    slotsArray(numHuecos).forEach((slot) => {
      const currentHueco = get(huecoState(slot)) || [];
      if (typeof newSnapshot.huecos === 'undefined') newSnapshot.huecos = [];
      if (
        init ||
        typeof lastSnap.huecos === 'undefined' ||
        currentHueco[0] !== lastSnap.huecos[slot][0]
      ) {
        newSnapshot.huecos[slot] = currentHueco;
      } else {
        newSnapshot.huecos[slot] = lastSnap.huecos[slot];
      }
    });

    slotsArray(numPilas).forEach((slot) => {
      const currentPila = get(pilaState(slot)) || [];
      if (typeof newSnapshot.pilas === 'undefined') newSnapshot.pilas = [];
      if (
        init ||
        typeof lastSnap.pilas === 'undefined' ||
        currentPila[0] !== lastSnap.pilas[slot][0]
      ) {
        newSnapshot.pilas[slot] = currentPila;
      } else {
        newSnapshot.pilas[slot] = lastSnap.pilas[slot];
      }
    });
    set(snapshots, [newSnapshot as MySnapshot, ...storedSnaps]);
  },
});

export const undoAction = selector({
  key: 'undoAction',
  get: () => undefined,
  set: ({ get, set }) => {
    const [, lastSnap, ...prevSnaps] = get(snapshots);
    set(mazoState, lastSnap.mazo);
    set(vistaState, lastSnap.vista);
    slotsArray(7).forEach((slot) => {
      set(huecoState(slot), lastSnap.huecos[slot]);
    });
    slotsArray(4).forEach((slot) => {
      set(pilaState(slot), lastSnap.pilas[slot]);
    });
    set(snapshots, [lastSnap, ...prevSnaps]);
  },
});
