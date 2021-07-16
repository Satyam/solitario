import { atom, selector } from 'recoil';
import { CardId, numHuecos, numPilas } from 'datos';
import { mazoState } from './mazo';
import { vistaState } from './vista';
import { slotsArray } from 'utils';
import { huecoState } from './huecos';
import { pilaState } from './pilas';

type MySnapshot = {
  mazo?: CardId[];
  pilas?: CardId[][];
  huecos?: CardId[][];
  vista?: CardId[];
};

export const snapshots = atom<MySnapshot[]>({
  key: 'snapshots',
  default: [],
});

export const saveSnapshot = selector({
  key: 'saveSnapshot',
  get: () => undefined,
  set: ({ get, set }) => {
    const newSnapshot: MySnapshot = {};
    const lastSnap = get(snapshots)[0] || {};

    const currentMazo = get(mazoState);
    if (currentMazo !== lastSnap.mazo) {
      newSnapshot.mazo = currentMazo;
    }

    const currentVista = get(vistaState);
    if (currentVista !== lastSnap.vista) {
      newSnapshot.vista = currentVista;
    }
    slotsArray(numHuecos).forEach((slot) => {
      const currentHueco = get(huecoState(slot));
      if (
        typeof lastSnap.huecos === 'undefined' ||
        currentHueco !== lastSnap.huecos[slot]
      ) {
        if (typeof newSnapshot.huecos === 'undefined') newSnapshot.huecos = [];
        newSnapshot.huecos[slot] = currentHueco;
      }
    });

    slotsArray(numPilas).forEach((slot) => {
      const currentPila = get(pilaState(slot));
      if (
        typeof lastSnap.pilas === 'undefined' ||
        currentPila !== lastSnap.pilas[slot]
      ) {
        if (typeof newSnapshot.pilas === 'undefined') newSnapshot.pilas = [];
        newSnapshot.pilas[slot] = currentPila;
      }
    });
    console.log(newSnapshot);
  },
});
