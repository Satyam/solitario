import { createAsyncThunk } from '@reduxjs/toolkit';
import { POS } from 'datos';
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
>('testaction', (_, { getState, dispatch }) => {
  do {
    const present = getState().juego.present;
    const cardId = present.vista[0];
    const toSlot = selPilaToSendCard(getState(), cardId);
    if (toSlot !== false) {
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
    if (
      present.huecos.some(({ cardIds }, fromSlot) => {
        const toSlot = selPilaToSendCard(getState(), cardIds[0]);
        if (toSlot !== false) {
          dispatch(
            jugadaAction({
              fromPos: POS.HUECO,
              fromSlot,
              cardIds: [cardIds[0]],
              toPos: POS.PILA,
              toSlot,
            })
          );
          return true;
        }
        return false;
      })
    )
      continue;
    break;
  } while (true);
  return;
});
