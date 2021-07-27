import { createAsyncThunk } from '@reduxjs/toolkit';
import { numHuecos, POS, tJugada, SPRITE_ID, ANIM_DURATION } from 'datos';
import {
  tAppDispatch,
  tRootState,
  selPilaToSendCard,
  selCoords,
  takeFrom,
  putInto,
} from 'store';
import { sleep } from 'utils';

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
    const spriteEl = document.getElementById(SPRITE_ID) as HTMLImageElement;
    if (!spriteEl) {
      console.error(`Card element with id ${SPRITE_ID} not found`);
      return Promise.reject(`Card element with id ${SPRITE_ID} not found`);
    }
    spriteEl.src = `assets/cards/${cardIds[0]}.svg`;
    spriteEl.style.top = `${fromTop}px`;
    spriteEl.style.left = `${fromLeft}px`;
    spriteEl.style.display = 'inline-block';
    // Mozilla docs suggests allowing a handful of ms after element is displayed
    // before starting transformation
    await sleep(10);
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
  }

  dispatch(putInto(jugada));
});
