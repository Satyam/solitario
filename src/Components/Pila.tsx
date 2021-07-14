import { useRecoilState } from 'recoil';
import { useDrop } from 'react-dnd';
import { pilaState } from 'store/pilas';
import Sprite from './Sprite';
import { HUECO, DRAG_TYPE, baraja, dragItem, dropResult } from 'datos';

const Pila = ({ slot }: { slot: number }) => {
  const [cartas, setCartas] = useRecoilState(pilaState(slot));
  const cardId = cartas[0];
  const [{ isOver }, drop] = useDrop<dragItem, dropResult, { isOver: boolean }>(
    () => ({
      accept: DRAG_TYPE,
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
      drop: (cartas) => {
        setCartas([cartas[0], ...cartas]);
        return cartas;
      },
      canDrop: (cartas) => {
        if (cartas.length !== 1) return false;
        const dropCarta = baraja[cartas[0]];
        if (cardId) {
          const topCarta = baraja[cardId];
          if (
            dropCarta.index === topCarta.index + 1 &&
            dropCarta.palo === topCarta.palo
          ) {
            console.log('accepted 2', { cartas, slot });
            return true;
          }
        } else {
          if (dropCarta.index === 0) {
            console.log('accepted 1', { cartas, slot });
            return true;
          }
        }
        console.log('rejected', { cartas, slot });
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
