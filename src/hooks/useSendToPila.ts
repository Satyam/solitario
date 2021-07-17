import { CardId } from 'datos';
import { PointerEventHandler } from 'react';
import { sendToPila } from 'store/globals';
import { useSetRecoilState } from 'recoil';
import { saveState } from 'store/undoStack';
export function useSendToPila(
  cardId: CardId,
  dropper: () => void
): PointerEventHandler {
  const send = useSetRecoilState(sendToPila);
  const saveStateAction = useSetRecoilState(saveState);
  return (ev) => {
    if (ev.buttons === 4) {
      ev.preventDefault();
      try {
        send(cardId);
        dropper();
        saveStateAction(false);
      } catch (err) {}
    }
  };
}

export default useSendToPila;
