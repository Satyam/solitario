import { tCardId, POS } from 'datos';
import { PointerEventHandler } from 'react';
import {
  useAppDispatch,
  useParamSelector,
  jugadaAction,
  selPilaToSendCard,
} from 'store';

export function useSendToPila(
  cardId: tCardId,
  fromPos: POS,
  fromSlot: number
): PointerEventHandler {
  const dispatch = useAppDispatch();
  const toSlot = useParamSelector<tCardId, number | false>(
    selPilaToSendCard,
    cardId
  );

  return (ev) => {
    if (ev.buttons === 4 && typeof toSlot === 'number') {
      ev.preventDefault();
      dispatch(
        jugadaAction({
          cardIds: [cardId],
          fromPos,
          fromSlot,
          toPos: POS.PILA,
          toSlot,
        })
      );
    }
  };
}

export default useSendToPila;
