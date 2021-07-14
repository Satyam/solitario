import { HUECO, DRAG_TYPE, dragItem, dropResult } from 'datos';
import { useRecoilState } from 'recoil';
import { useDrag } from 'react-dnd';
import { vistaState } from 'store/vista';
import Sprite from './Sprite';
import useSendToPila from 'useSendToPila';

const Vista = () => {
  const [cardIds, setCardIds] = useRecoilState(vistaState);
  const cardId = cardIds[0];
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
        }
      },
    }),
    [cardId]
  );

  const onPointerHandler = useSendToPila(cardId, () =>
    setCardIds(cardIds.slice(1))
  );
  return (
    <div ref={drag} onPointerDown={onPointerHandler}>
      <Sprite
        cardId={cardId || HUECO}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      />
    </div>
  );
};

export default Vista;
