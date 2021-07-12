import { useRecoilState, useRecoilValue } from 'recoil';
import { useDrop } from 'react-dnd';
import { huecoState, firstShownState } from 'store/huecos';
import CardStack from './CardStack';
import { DRAG_TYPES, dragItem, dropResult, baraja } from 'datos';

const Hueco = ({ slot }: { slot: number }) => {
  const [cartas, setCartas] = useRecoilState(huecoState(slot));
  const cardId = cartas[0];
  const firstShown = useRecoilValue(firstShownState(slot));
  const [{ isOver }, drop] = useDrop<dragItem, dropResult, { isOver: boolean }>(
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
            dropCarta.index === topCarta.index - 1 &&
            dropCarta.color !== topCarta.color
          ) {
            console.log('accepted 2', { ...item, slot });
            return true;
          }
        } else {
          if (dropCarta.index === 11) {
            console.log('accepted 1', { ...item, slot });
            return true;
          }
        }
        console.log('rejected', { ...item, cartas, slot });
        return false;
      },
    }),
    [cartas]
  );
  console.log(slot, firstShown, cartas);
  return (
    <div
      ref={drop}
      style={{
        border: isOver ? 'thin solid yellow' : 'none',
      }}
    >
      <CardStack cartas={cartas} firstShown={firstShown} />
    </div>
  );
};

export default Hueco;
