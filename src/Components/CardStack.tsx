import { useDrag } from 'react-dnd';
import { useAppDispatch } from 'store';
import { jugadaAction } from 'store/juegoSlice';
import {
  REVERSO,
  CardId,
  dropResult,
  dragItem,
  dragCollectedProps,
  DRAG_TYPE,
  POS,
} from 'datos';
import Sprite from './Sprite';

const CardStack = ({
  cardIds,
  firstShown,
  index = 0,
  total = 0,
  slot,
}: {
  cardIds: CardId[];
  firstShown: number;
  index?: number;
  total?: number;
  slot: number;
}) => {
  const dispatch = useAppDispatch();
  const [{ isDragging }, drag] = useDrag<
    dragItem,
    dropResult,
    dragCollectedProps
  >(
    () => ({
      type: DRAG_TYPE,
      item: cardIds,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: () => index >= firstShown,
      end: (_, monitor) => {
        if (monitor.didDrop()) {
          dispatch(
            jugadaAction({
              ...(monitor.getDropResult() as dropResult),
              cardIds,
              fromPos: POS.HUECO,
              fromSlot: slot,
            })
          );
        }
      },
    }),
    [cardIds]
  );

  const isLast = cardIds.length === 1;
  total = total || cardIds.length;

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className={isLast ? '' : 'stackedSprite'}>
        <Sprite
          cardId={index >= firstShown ? cardIds[cardIds.length - 1] : REVERSO}
          index={index}
        />
      </div>
      {isLast ? null : (
        <CardStack
          cardIds={cardIds.slice(0, -1)}
          firstShown={firstShown}
          index={index + 1}
          total={total}
          slot={slot}
        />
      )}
    </div>
  );
};

export default CardStack;
