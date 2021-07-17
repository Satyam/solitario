import { CardId } from 'datos';
import { PointerEventHandler } from 'react';
import { sendToPila } from 'store/globals';
import { useSetRecoilState } from 'recoil';
import { saveSnapshot } from 'store/snapshots';
export function useSendToPila(
  cardId: CardId,
  dropper: () => void
): PointerEventHandler {
  const send = useSetRecoilState(sendToPila);
  const saveState = useSetRecoilState(saveSnapshot);
  return (ev) => {
    if (ev.buttons === 4) {
      ev.preventDefault();
      try {
        send(cardId);
        dropper();
        saveState(false);
      } catch (err) {}
    }
  };
}

export default useSendToPila;
