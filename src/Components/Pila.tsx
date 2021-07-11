import { useRecoilState } from 'recoil';
import { useDrop } from 'react-dnd';
import { pilaState } from 'store/pilas';
import Sprite from './Sprite';
import { HUECO, DRAG_TYPES, baraja, dragItem, dropResult } from 'datos';

const Pila = ({ slot }: { slot: number }) => {
  const [cartas, setCartas] = useRecoilState(pilaState(slot));
  const cardId = cartas[0];
  const [{ isOver }, drop] = useDrop<dragItem, dropResult, { isOver: boolean }>(
    () => ({
      accept: DRAG_TYPES.VISTA,
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
      drop: (item, monitor) => ({ ...item, slot }),
      canDrop: (item, monitor) => {
        if (cardId) {
          console.log('rejected');
          return false;
        } else {
          if (baraja[item.cardId].index === 0) {
            console.log('accepted', item);
            setCartas([item.cardId, ...cartas]);
            return true;
          }
          console.log('also rejected');
          return false;
        }
      },
    }),
    [cardId]
  );
  return (
    <div ref={drop} style={{ border: isOver ? 'thin solid yellow' : 'none' }}>
      <Sprite cardId={cardId || HUECO} />
    </div>
  );
};

export default Pila;
