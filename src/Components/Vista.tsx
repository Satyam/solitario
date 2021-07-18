import {
  HUECO,
  DRAG_TYPE,
  dragItem,
  dropResult,
  dragCollectedProps,
} from 'datos';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useDrag } from 'react-dnd';
import { vistaState } from 'store/vista';
import Sprite from './Sprite';
import useSendToPila from 'hooks/useSendToPila';
import { saveState } from 'store/undoStack';
const Vista = () => {
  const [cardIds, setCardIds] = useRecoilState(vistaState);
  const saveStateAction = useSetRecoilState(saveState);
  const cardId = cardIds[0];
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
          setCardIds(cardIds.slice(1));
          saveStateAction(false);
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
