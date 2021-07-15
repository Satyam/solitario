import { CardId } from 'datos';
import { PointerEventHandler } from 'react';
import { sendToPila } from 'store/globals';
import { useSetRecoilState } from 'recoil';

export function useSendToPila(
  cardId: CardId,
  dropper: () => void
): PointerEventHandler {
  const send = useSetRecoilState(sendToPila);
  return (ev) => {
    if (ev.buttons === 4) {
      ev.preventDefault();
      try {
        send(cardId);
        dropper();
      } catch (err) {}
    }
  };
}

export default useSendToPila;
