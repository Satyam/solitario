import { useRecoilState } from 'recoil';
import { useDrop } from 'react-dnd';
import { huecoState, firstShownState } from 'store/huecos';
import CardStack from 'Components/CardStack';
import Sprite from 'Components/Sprite';
import {
  DRAG_TYPES,
  dragItem,
  dropResult,
  baraja,
  CARTA_HEIGHT,
  OFFSET_PILA,
  HUECO,
  CardId,
} from 'datos';

const Hueco = ({ slot }: { slot: number }) => {
  const [cartas, setCartas] = useRecoilState(huecoState(slot));
  const cardId = cartas[0];
  const [firstShown, setFirstShown] = useRecoilState(firstShownState(slot));

  const canDropTest = (droppedCardId: CardId): boolean => {
    const droppedCarta = baraja[droppedCardId];
    if (cardId) {
      const topCarta = baraja[cardId];
      if (
        droppedCarta.index === topCarta.index - 1 &&
        droppedCarta.color !== topCarta.color
      ) {
        console.log('accepted 2', { droppedCardId, cardId, slot });
        return true;
      }
    } else {
      if (droppedCarta.index === 12) {
        console.log('accepted 1', { droppedCardId, cardId, slot });
        return true;
      }
    }
    console.log('rejected', { droppedCardId, cardId, slot });
    return false;
  };
  const [{ isOver }, drop] = useDrop<dragItem, dropResult, { isOver: boolean }>(
    () => ({
      accept: [DRAG_TYPES.VISTA, DRAG_TYPES.HUECOS],
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
      drop: (item, monitor) => {
        switch (monitor.getItemType()) {
          case DRAG_TYPES.VISTA:
            const droppedCardId = item.cardId as CardId;
            setCartas([droppedCardId, ...cartas]);
            return { ...item, slot };
          case DRAG_TYPES.HUECOS: {
            const droppedCartas = item.cartas as CardId[];
            setCartas([...droppedCartas, ...cartas]);
            return { ...item, slot, pila: false };
          }
        }
      },
      canDrop: (item, monitor) => {
        switch (monitor.getItemType()) {
          case DRAG_TYPES.VISTA:
            return canDropTest(item.cardId as CardId);

          case DRAG_TYPES.HUECOS: {
            const droppedCartas = item.cartas as CardId[];
            return canDropTest(droppedCartas[droppedCartas.length - 1]);
          }
          default:
            return false;
        }
      },
    }),
    [cartas]
  );

  const dropCartas = (dropped: CardId[]) => {
    console.log('dropCartas', { cartas, dropped, firstShown });
    const newStack = cartas.slice(dropped.length);
    setCartas(newStack);
    if (firstShown >= newStack.length) {
      setFirstShown(newStack.length - 1);
    }
  };

  if (slot === 2) console.log({ firstShown, cartas });
  return (
    <div
      ref={drop}
      style={{
        border: isOver ? 'thin solid yellow' : 'none',
        height: OFFSET_PILA * cartas.length + CARTA_HEIGHT,
      }}
    >
      {cartas.length ? (
        <CardStack
          cartas={cartas}
          firstShown={firstShown}
          dropCartas={dropCartas}
        />
      ) : (
        <Sprite cardId={HUECO} />
      )}
    </div>
  );
};

export default Hueco;
