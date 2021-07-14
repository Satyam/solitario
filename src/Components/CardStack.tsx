import { useDrag } from 'react-dnd';
import { REVERSO, CardId, dropResult, dragItem, DRAG_TYPE } from 'datos';
import Sprite from './Sprite';

const CardStack = ({
  cartas,
  firstShown,
  index = 0,
  total = 0,
  dropCartas,
}: {
  cartas: CardId[];
  firstShown: number;
  index?: number;
  total?: number;
  dropCartas: (cartas: CardId[]) => void;
}) => {
  const [{ isDragging }, drag] = useDrag<
    dragItem,
    dropResult,
    { isDragging: boolean }
  >(
    () => ({
      type: DRAG_TYPE,
      item: cartas,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: () => index >= firstShown,
      end: (item, monitor) => {
        dropCartas(cartas);
        console.log(
          'useDrag end',
          item,
          monitor.getDropResult(),
          monitor.didDrop()
        );
      },
    }),
    [cartas]
  );
  const isLast = cartas.length === 1;
  total = total || cartas.length;
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className={isLast ? '' : 'stackedSprite'}>
        <Sprite
          cardId={index >= firstShown ? cartas[cartas.length - 1] : REVERSO}
          index={index}
        />
      </div>
      {isLast ? null : (
        <CardStack
          cartas={cartas.slice(0, -1)}
          firstShown={firstShown}
          index={index + 1}
          total={total}
          dropCartas={dropCartas}
        />
      )}
    </div>
  );
};

export default CardStack;
