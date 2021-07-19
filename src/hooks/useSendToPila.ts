import { CardId, POS } from 'datos';
import { PointerEventHandler } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selPilaToSendCard } from 'store/selectors';
import { RootState } from 'store';
import { jugadaAction } from 'store/juegoSlice';

export function useSendToPila(
  cardId: CardId,
  fromPos: POS,
  fromSlot: number
): PointerEventHandler {
  const dispatch = useDispatch();
  const toSlot = useSelector<RootState>((state) =>
    selPilaToSendCard(state, cardId)
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
