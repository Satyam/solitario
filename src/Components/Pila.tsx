import { useRecoilState } from 'recoil';
import { useDrop } from 'react-dnd';
import { pilaState } from 'store/pilas';
import Sprite from './Sprite';
import {
  HUECO,
  DRAG_TYPES,
  baraja,
  vistaDragItem,
  vistaDropResult,
} from 'datos';

const Pila = ({ slot }: { slot: number }) => {
  const [cartas, setCartas] = useRecoilState(pilaState(slot));
  const cardId = cartas[0];
  const [{ isOver }, drop] = useDrop<
    vistaDragItem,
    vistaDropResult,
    { isOver: boolean }
  >(
    () => ({
      accept: DRAG_TYPES.VISTA,
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
      drop: (item) => {
        setCartas([item.cardId, ...cartas]);
        return { ...item, slot };
      },
      canDrop: (item) => {
        const dropCarta = baraja[item.cardId];
        if (cardId) {
          const topCarta = baraja[cardId];
          if (
            dropCarta.index === topCarta.index + 1 &&
            dropCarta.palo === topCarta.palo
          ) {
            console.log('accepted 2', { ...item, slot });
            return true;
          }
        } else {
          if (dropCarta.index === 0) {
            console.log('accepted 1', { ...item, slot });
            return true;
          }
        }
        console.log('rejected', { ...item, slot });
        return false;
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
