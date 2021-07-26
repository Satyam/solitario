import { createAsyncThunk } from '@reduxjs/toolkit';
import { moveCard } from 'Components/CardSprite';
import { numHuecos, POS } from 'datos';
import {
  tAppDispatch,
  tRootState,
  selPilaToSendCard,
  jugadaAction,
} from 'store';

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
      await moveCard({
        cardId,
        fromClassName: POS.VISTA,
        toClassName: `${POS.PILA}${toSlot}`,
      });
      dispatch(
        jugadaAction({
          fromPos: POS.VISTA,
          fromSlot: 0,
          cardIds: [present.vista[0]],
          toPos: POS.PILA,
          toSlot,
        })
      );
      continue;
    }

    for (let fromSlot = 0; fromSlot < numHuecos; fromSlot++) {
      const cardId = present.huecos[fromSlot].cardIds[0];
      const toSlot = selPilaToSendCard(getState(), cardId);
      if (toSlot !== false) {
        await moveCard({
          cardId,
          fromClassName: `${POS.HUECO}${fromSlot}`,
          toClassName: `${POS.PILA}${toSlot}`,
        });
        dispatch(
          jugadaAction({
            fromPos: POS.HUECO,
            fromSlot,
            cardIds: [cardId],
            toPos: POS.PILA,
            toSlot,
          })
        );
        continue loop;
      }
    }
    break;
  } while (true);
  return;
});
