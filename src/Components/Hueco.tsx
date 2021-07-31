import { useDrop } from 'react-dnd';
import { useParamSelector, selHueco } from 'store';
import useSendToPila from 'hooks/useSendToPila';
import CardStack from 'Components/CardStack';
import Card from 'Components/Card';
import {
  DRAG_TYPE,
  tDragItem,
  tDropResult,
  tDropCollectedProps,
  baraja,
  HUECO,
  POS,
  tHuecoState,
} from 'datos';

const Hueco = ({ slot }: { slot: number }) => {
  const { cardIds, firstShown } = useParamSelector<number, tHuecoState>(
    selHueco,
    slot
  );
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
    <div ref={drop} className="dropArea">
      <div
        onPointerDown={onPointerHandler}
        className="dropTarget"
        style={{
          borderColor: isOver ? (canDrop ? 'cyan' : 'red') : 'darkgreen',
        }}
      >
        {cardIds.length ? (
          <CardStack cardIds={cardIds} firstShown={firstShown} slot={slot} />
        ) : (
          <Card cardId={HUECO} />
        )}
      </div>
    </div>
  );
};

export default Hueco;
