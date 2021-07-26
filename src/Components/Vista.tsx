import {
  HUECO,
  DRAG_TYPE,
  tDragItem,
  tDropResult,
  tDragCollectedProps,
  POS,
  tCardId,
} from 'datos';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector, jugadaAction, selVista } from 'store';
import { useSendToPila } from 'hooks/useSendToPila';
import Card from 'Components/Card';

const Vista = () => {
  const dispatch = useAppDispatch();
  const cardIds = useAppSelector<tCardId[]>(selVista);
  const cardId = cardIds[0];

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
      end: (cardIds, monitor) => {
        if (monitor.didDrop()) {
          dispatch(
            jugadaAction({
              ...(monitor.getDropResult() as tDropResult),
              cardIds,
              fromPos: POS.VISTA,
              fromSlot: 0,
            })
          );
        }
      },
    }),
    [cardId]
  );

  const onPointerHandler = useSendToPila(cardId, POS.VISTA, 0);

  return (
    <div ref={drag} onPointerDown={onPointerHandler}>
      <Card
        cardId={cardId || HUECO}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className={`${POS.VISTA}0`}
      />
    </div>
  );
};

export default Vista;
