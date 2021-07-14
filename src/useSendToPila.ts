import { CardId, baraja } from 'datos';
import { PointerEventHandler } from 'react';
import { pilaState } from 'store/pilas';
import { useRecoilState } from 'recoil';

export function useSendToPila(
  cardId: CardId,
  dropper: () => void
): PointerEventHandler {
  const p = [
    useRecoilState(pilaState(0)),
    useRecoilState(pilaState(1)),
    useRecoilState(pilaState(2)),
    useRecoilState(pilaState(3)),
  ];
  return (ev) => {
    if (ev.buttons === 4) {
      ev.preventDefault();
      console.log('vista to pila', cardId);
      const droppedCarta = baraja[cardId];
      for (let slot = 0; slot < 4; slot++) {
        const [cardIds, setCardIds] = p[slot];
        if (cardIds.length) {
          const topCarta = baraja[cardIds[0]];
          if (
            droppedCarta.index === topCarta.index + 1 &&
            droppedCarta.palo === topCarta.palo
          ) {
            setCardIds([cardId, ...cardIds]);
            dropper();
            break;
          }
        } else {
          if (droppedCarta.index === 0) {
            setCardIds([cardId, ...cardIds]);
            dropper();
            break;
          }
        }
      }
    }
  };
}

export default useSendToPila;
