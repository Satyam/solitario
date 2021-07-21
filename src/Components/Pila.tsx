import { useDrop, useDrag } from 'react-dnd';
import { useAppSelector, useAppDispatch, jugadaAction } from 'store';
import Sprite from './Sprite';
import {
  HUECO,
  DRAG_TYPE,
  baraja,
  dragItem,
  dropResult,
  dropCollectedProps,
  dragCollectedProps,
  POS,
  CardId,
} from 'datos';

const Pila = ({ slot }: { slot: number }) => {
  const cardIds = useAppSelector<CardId[]>(
    (state) => state.juego.present.pilas[slot]
  );
  const dispatch = useAppDispatch();
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
        return { toPos: POS.PILA, toSlot: slot };
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
  const [{ isDragging }, drag] = useDrag<
    dragItem,
    dropResult,
    dragCollectedProps
  >(
    () => ({
      type: DRAG_TYPE,
      item: [cardId],
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (_, monitor) => {
        if (monitor.didDrop()) {
          dispatch(
            jugadaAction({
              ...(monitor.getDropResult() as dropResult),
              cardIds,
              fromPos: POS.PILA,
              fromSlot: slot,
            })
          );
        }
      },
    }),
    [cardId]
  );
  const ref = (el: HTMLDivElement) => {
    drag(el);
    drop(el);
  };
  return (
    <div
      ref={ref}
      className="dropTarget"
      style={{ borderColor: isOver ? (canDrop ? 'cyan' : 'red') : 'darkgreen' }}
    >
      <Sprite
        cardId={cardId || HUECO}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      />
    </div>
  );
};

export default Pila;
