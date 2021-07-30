import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  numHuecos,
  POS,
  tJugada,
  SPRITE_ID,
  ANIM_DURATION,
  tCardId,
  numPilas,
} from 'datos';

import {
  tAppDispatch,
  tRootState,
  selPilaToSendCard,
  selCoords,
  selHasWon,
  takeFrom,
  putInto,
} from 'store';
import { sleep } from 'utils';
import { selPila } from './selectors';

export const raiseAction = createAsyncThunk<
  void,
  void,
  { dispatch: tAppDispatch; state: tRootState }
>('raiseAction', async (_, { getState, dispatch }) => {
  loop: do {
    const present = getState().juego.present;
    const cardId = present.vista[0];
    const toSlot = selPilaToSendCard(getState(), cardId);
    if (toSlot !== false) {
      await dispatch(
        jugadaAction({
          fromPos: POS.VISTA,
          fromSlot: 0,
          cardIds: [present.vista[0]],
          toPos: POS.PILA,
          toSlot,
          anim: true,
        })
      );
      continue;
    }

    for (let fromSlot = 0; fromSlot < numHuecos; fromSlot++) {
      const cardId = present.huecos[fromSlot].cardIds[0];
      const toSlot = selPilaToSendCard(getState(), cardId);
      if (toSlot !== false) {
        await dispatch(
          jugadaAction({
            fromPos: POS.HUECO,
            fromSlot,
            cardIds: [cardId],
            toPos: POS.PILA,
            toSlot,
            anim: true,
          })
        );
        continue loop;
      }
    }
    break;
  } while (true);
  return;
});

const moveCarta = async (
  cardId: tCardId,
  fromTop: number,
  fromLeft: number,
  toTop: number,
  toLeft: number
): Promise<void> => {
  const spriteEl = document.getElementById(SPRITE_ID) as HTMLImageElement;
  if (!spriteEl) {
    console.error(`Card element with id ${SPRITE_ID} not found`);
    return Promise.reject(`Card element with id ${SPRITE_ID} not found`);
  }

  spriteEl.src = `assets/cards/${cardId}.svg`;
  spriteEl.style.top = `${fromTop}px`;
  spriteEl.style.left = `${fromLeft}px`;
  spriteEl.style.display = 'inline-block';
  // Mozilla docs suggests allowing a handful of ms after element is displayed
  // before starting transformation
  await sleep(20);
  spriteEl.style.transform = `translate(${toLeft - fromLeft}px, ${
    toTop - fromTop
  }px)`;
  spriteEl.style.transition = `transform ${ANIM_DURATION}ms ease-in-out`;
  await new Promise<void>((resolve) => {
    const updateTransition = () => {
      spriteEl.removeEventListener('transitionend', updateTransition);
      resolve();
    };
    spriteEl.addEventListener('transitionend', updateTransition, true);
  });
  spriteEl.style.display = 'none';
  spriteEl.style.transform = 'none';
  spriteEl.style.transition = 'unset';
};

export const jugadaAction = createAsyncThunk<
  void,
  tJugada,
  { dispatch: tAppDispatch; state: tRootState }
>('jugadaAction', async (jugada, { dispatch, getState }) => {
  const { cardIds, toPos, toSlot, fromPos, fromSlot, anim } = jugada;

  const { left: fromLeft, top: fromTop } = selCoords(
    getState(),
    `${fromPos}${fromSlot}`
  );
  const { left: toLeft, top: toTop } = selCoords(
    getState(),
    `${toPos}${toSlot}`
  );
  dispatch(takeFrom(jugada));

  if (cardIds.length === 1 && anim) {
    await moveCarta(cardIds[0], fromTop, fromLeft, toTop, toLeft);
  }

  dispatch(putInto(jugada));
  if (selHasWon(getState())) {
    await sleep(300);
    await dispatch(winAnimation());
  }
});

export const winAnimation = createAsyncThunk<
  void,
  void,
  { dispatch: tAppDispatch; state: tRootState }
>('winAnimation', async (_, { dispatch, getState }) => {
  const { width, bottom } = document.body.getBoundingClientRect();

  let count: number;
  do {
    count = 0;
    for (let slot = 0; slot < numPilas; slot++) {
      const cardIds = selPila(getState(), slot);
      if (cardIds.length > 0) {
        count += 1;
        dispatch(
          takeFrom({
            cardIds: [cardIds[0]],
            toPos: POS.MAZO,
            toSlot: 0,
            fromPos: POS.PILA,
            fromSlot: slot,
          })
        );
        const { left, top } = selCoords(getState(), `${POS.PILA}${slot}`);
        await moveCarta(cardIds[0], top, left, bottom, width / 2);
      }
    }
  } while (count);
});
