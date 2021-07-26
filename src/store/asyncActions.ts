import { createAsyncThunk } from '@reduxjs/toolkit';
import { numHuecos, POS, tJugada, SPRITE_ID, ANIM_DURATION } from 'datos';
import {
  tAppDispatch,
  tRootState,
  selPilaToSendCard,
  // jugadaAction,
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
>('jugadaAction', async (jugada, { dispatch }) => {
  const { cardIds, toPos, toSlot, fromPos, fromSlot, anim } = jugada;

  dispatch(takeFrom(jugada));

  if (cardIds.length === 1 && anim) {
    const fromClassName = `${fromPos}${fromSlot}`;
    const fromEl = document.getElementsByClassName(fromClassName)[0];
    if (!fromEl)
      return Promise.reject(
        `Source element with class ${fromClassName} not found`
      );
    const { left: fromX, top: fromY } = fromEl.getBoundingClientRect();

    const toClassName = `${toPos}${toSlot}`;
    const toEl = document.getElementsByClassName(toClassName)[0];
    if (!toEl)
      return Promise.reject(
        `Source element with class ${toClassName} not found`
      );
    const { left: toX, top: toY } = toEl.getBoundingClientRect();

    const spriteEl = document.getElementById(SPRITE_ID) as HTMLImageElement;
    if (!spriteEl)
      return Promise.reject(`Card element with id ${SPRITE_ID} not found`);

    spriteEl.src = `assets/cards/${cardIds[0]}.svg`;
    spriteEl.style.top = `${fromY}px`;
    spriteEl.style.left = `${fromX}px`;
    spriteEl.style.display = 'inline-block';
    // Mozilla docs suggests allowing a handful of ms after element is displayed
    // before starting transformation
    await sleep(10);
    spriteEl.style.transform = `translate(${toX - fromX}px, ${toY - fromY}px)`;
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
