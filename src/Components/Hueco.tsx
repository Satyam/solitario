import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import useSendToPila from 'hooks/useSendToPila';
import CardStack from 'Components/CardStack';
import Sprite from 'Components/Sprite';
import {
  DRAG_TYPE,
  dragItem,
  dropResult,
  dropCollectedProps,
  baraja,
  HUECO,
  CardId,
  POS,
} from 'datos';
import { RootState } from 'store';

const Hueco = ({ slot }: { slot: number }) => {
  const { cardIds, firstShown } = useSelector<
    RootState,
    { cardIds: CardId[]; firstShown: number }
  >((state) => state.juego.huecos[slot]);
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
      drop: () => {
        return { toPos: POS.HUECO, toSlot: slot };
      },
      canDrop: (droppedCardIds) => {
        const droppedCardId = droppedCardIds[droppedCardIds.length - 1];
        const droppedCarta = baraja[droppedCardId];
        if (cardId) {
          const topCarta = baraja[cardId];
          if (
            droppedCarta.index === topCarta.index - 1 &&
            droppedCarta.color !== topCarta.color
          ) {
            return true;
          }
        } else {
          if (droppedCarta.index === 12) {
            return true;
          }
        }
        return false;
      },
    }),
    [cardIds]
  );

  const onPointerHandler = useSendToPila(cardId, POS.HUECO, slot);
  return (
    <div
      ref={drop}
      onPointerDown={onPointerHandler}
      className="dropTarget"
      style={{ borderColor: isOver ? (canDrop ? 'cyan' : 'red') : 'darkgreen' }}
    >
      {cardIds.length ? (
        <CardStack cardIds={cardIds} firstShown={firstShown} slot={slot} />
      ) : (
        <Sprite cardId={HUECO} />
      )}
    </div>
  );
};

export default Hueco;
