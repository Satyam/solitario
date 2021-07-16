import { mazoState } from 'store/mazo';
import { huecoState, firstShownState } from 'store/huecos';
import { vistaState } from 'store/vista';
import { pilaState } from 'store/pilas';
import { DefaultValue, selector } from 'recoil';
import { getRandomInt } from 'utils';
import {
  CardId,
  numCartas,
  numPalos,
  numValores,
  valores,
  palos,
  baraja,
  REVERSO,
} from 'datos';

export const init = selector({
  key: 'initSelector',
  get: () => undefined,
  set: ({ set, reset }) => {
    reset(vistaState);
    for (let slot = 0; slot < 4; slot++) {
      reset(pilaState(slot));
    }

    const cardIds: CardId[] = [];
    while (cardIds.length < numCartas) {
      let p = getRandomInt(numPalos - 1);
      let v = getRandomInt(numValores - 1);
      const cardId = `${valores[v]}${palos[p]}` as CardId;
      if (!cardIds.includes(cardId)) {
        cardIds.push(cardId);
      }
    }
    for (let slot = 0; slot < 7; slot++) {
      set(firstShownState(slot), slot);
      set(huecoState(slot), cardIds.splice(0, slot + 1));
    }
    set(mazoState, cardIds);
  },
});

export const sendToPila = selector<CardId>({
  key: 'sendToPilaSelector',
  get: () => REVERSO,
  set: ({ get, set }, cardId) => {
    if (cardId instanceof DefaultValue) return;
    const droppedCarta = baraja[cardId];
    let done = false;
    for (let slot = 0; slot < 4; slot++) {
      const cardIds = get(pilaState(slot));
      if (cardIds.length) {
        const topCarta = baraja[cardIds[0]];
        if (
          droppedCarta.index === topCarta.index + 1 &&
          droppedCarta.palo === topCarta.palo
        ) {
          set(pilaState(slot), [cardId, ...cardIds]);
          done = true;
          break;
        }
      } else {
        if (droppedCarta.index === 0) {
          set(pilaState(slot), [cardId, ...cardIds]);
          done = true;
          break;
        }
      }
    }
    if (!done) {
      throw new Error('cannot set');
    }
  },
});
