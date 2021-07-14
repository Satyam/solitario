import { useRecoilState } from 'recoil';
import { useDrop } from 'react-dnd';
import { pilaState } from 'store/pilas';
import Sprite from './Sprite';
import {
  HUECO,
  DRAG_TYPE,
  baraja,
  dragItem,
  dropResult,
  dropCollectedProps,
} from 'datos';

const Pila = ({ slot }: { slot: number }) => {
  const [cardIds, setCardIds] = useRecoilState(pilaState(slot));
  const cardId = cardIds[0];
  const [{ isOver, canDrop }, drop] = useDrop<
    dragItem,
    dropResult,
    dropCollectedProps
  >(
    () => ({
      accept: DRAG_TYPE,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
      drop: (droppedCardIds) => {
        setCardIds([droppedCardIds[0], ...cardIds]);
        return droppedCardIds;
      },
      canDrop: (droppedCardIds) => {
        if (droppedCardIds.length !== 1) return false;
        const droppedCarta = baraja[droppedCardIds[0]];
        if (cardId) {
          const topCarta = baraja[cardId];
          if (
            droppedCarta.index === topCarta.index + 1 &&
            droppedCarta.palo === topCarta.palo
          ) {
            return true;
          }
        } else {
          if (droppedCarta.index === 0) {
            return true;
          }
        }
        return false;
      },
    }),
    [cardId]
  );
  return (
    <div
      ref={drop}
      className="dropTarget"
      style={{ borderColor: isOver ? (canDrop ? 'cyan' : 'red') : 'darkgreen' }}
    >
      <Sprite cardId={cardId || HUECO} />
    </div>
  );
};

export default Pila;
