import { useRecoilState, useSetRecoilState } from 'recoil';
import { useDrop, useDrag } from 'react-dnd';
import { pilaState } from 'store/pilas';
import { saveState } from 'store/undoStack';
import Sprite from './Sprite';
import {
  HUECO,
  DRAG_TYPE,
  baraja,
  dragItem,
  dropResult,
  dropCollectedProps,
} from 'datos';
import React from 'react';

const Pila = ({ slot }: { slot: number }) => {
  const [cardIds, setCardIds] = useRecoilState(pilaState(slot));
  const saveStateAction = useSetRecoilState(saveState);
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
  const [{ isDragging }, drag] = useDrag<
    dragItem,
    dropResult,
    { isDragging: boolean }
  >(
    () => ({
      type: DRAG_TYPE,
      item: [cardId],
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          setCardIds(cardIds.slice(1));
          saveStateAction(false);
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
