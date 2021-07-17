import { useDrag } from 'react-dnd';
import { useSetRecoilState } from 'recoil';
import { REVERSO, CardId, dropResult, dragItem, DRAG_TYPE } from 'datos';
import Sprite from './Sprite';
import { saveSnapshot } from 'store/snapshots';

const CardStack = ({
  cardIds,
  firstShown,
  index = 0,
  total = 0,
  dropCardIds,
}: {
  cardIds: CardId[];
  firstShown: number;
  index?: number;
  total?: number;
  dropCardIds: (cardIds: CardId[]) => void;
}) => {
  const saveState = useSetRecoilState(saveSnapshot);
  const [{ isDragging }, drag] = useDrag<
    dragItem,
    dropResult,
    { isDragging: boolean }
  >(
    () => ({
      type: DRAG_TYPE,
      item: cardIds,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: () => index >= firstShown,
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          dropCardIds(cardIds);
          saveState(false);
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
          dropCardIds={dropCardIds}
        />
      )}
    </div>
  );
};

export default CardStack;
