import { HUECO, DRAG_TYPE, dragItem, dropResult } from 'datos';
import { useRecoilState } from 'recoil';
import { useDrag } from 'react-dnd';
import { vistaState } from 'store/vista';
import Sprite from './Sprite';

const Vista = () => {
  const [cartas, setCartas] = useRecoilState(vistaState);
  const cardId = cartas[0];
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
          setCartas(cartas.slice(1));
        } else {
          console.error('Vista: end got called without didDrop');
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
