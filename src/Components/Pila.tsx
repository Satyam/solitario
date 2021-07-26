import { useDrop, useDrag } from 'react-dnd';
import { useParamSelector, useAppDispatch, jugadaAction, selPila } from 'store';
import Card from 'Components/Card';
import {
  HUECO,
  DRAG_TYPE,
  baraja,
  tDragItem,
  tDropResult,
  tDropCollectedProps,
  tDragCollectedProps,
  POS,
  tCardId,
} from 'datos';

const Pila = ({ slot }: { slot: number }) => {
  const cardIds = useParamSelector<number, tCardId[]>(selPila, slot);
  const dispatch = useAppDispatch();
  const cardId = cardIds[0];
  const [{ isOver, canDrop }, drop] = useDrop<
    tDragItem,
    tDropResult,
    tDropCollectedProps
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
    tDragItem,
    tDropResult,
    tDragCollectedProps
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
              ...(monitor.getDropResult() as tDropResult),
              cardIds: [cardId],
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
      <Card
        cardId={cardId || HUECO}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className={`${POS.PILA}${slot}`}
      />
    </div>
  );
};

export default Pila;
