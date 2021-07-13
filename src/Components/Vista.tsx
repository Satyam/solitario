import { HUECO, DRAG_TYPES, vistaDragItem, vistaDropResult } from 'datos';
import { useRecoilState } from 'recoil';
import { useDrag } from 'react-dnd';
import { vistaState } from 'store/vista';
import Sprite from './Sprite';

const Vista = () => {
  const [cartas, setCartas] = useRecoilState(vistaState);
  const cardId = cartas[0];
  const [{ isDragging }, drag] = useDrag<
    vistaDragItem,
    vistaDropResult,
    { isDragging: boolean }
  >(
    () => ({
      type: DRAG_TYPES.VISTA,
      item: { cardId },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        console.log('useDrag end', item, monitor.getDropResult());
        if (monitor.didDrop()) {
          setCartas(cartas.slice(1));
        }
      },
    }),
    [cardId]
  );
  return (
    <div ref={drag}>
      <Sprite
        cardId={cardId || HUECO}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      />
    </div>
  );
};

export default Vista;
