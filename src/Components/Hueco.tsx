import { useRecoilState } from 'recoil';
import { useDrop } from 'react-dnd';
import { huecoState, firstShownState } from 'store/huecos';
import CardStack from 'Components/CardStack';
import Sprite from 'Components/Sprite';
import {
  DRAG_TYPE,
  dragItem,
  dropResult,
  dropCollectedProps,
  baraja,
  HUECO,
  CardId,
} from 'datos';

const Hueco = ({ slot }: { slot: number }) => {
  const [cardIds, setCardIds] = useRecoilState(huecoState(slot));
  const cardId = cardIds[0];
  const [firstShown, setFirstShown] = useRecoilState(firstShownState(slot));

  const canDropTest = (droppedCardId: CardId): boolean => {
    const droppedCarta = baraja[droppedCardId];
    if (cardId) {
      const topCarta = baraja[cardId];
      if (
        droppedCarta.index === topCarta.index - 1 &&
        droppedCarta.color !== topCarta.color
      ) {
        return true;
      }
    } else {
      if (droppedCarta.index === 12) {
        return true;
      }
    }
    return false;
  };

  const [{ isOver, canDrop }, drop] = useDrop<
    dragItem,
    dropResult,
    dropCollectedProps
  >(
    () => ({
      accept: DRAG_TYPE,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
      drop: (droppedCartas) => {
        setCardIds([...droppedCartas, ...cardIds]);
        return droppedCartas;
      },
      canDrop: (droppedCartas) => {
        return canDropTest(droppedCartas[droppedCartas.length - 1]);
      },
    }),
    [cardIds]
  );

  const dropCardIds = (dropped: CardId[]) => {
    const newStack = cardIds.slice(dropped.length);
    setCardIds(newStack);
    if (firstShown >= newStack.length) {
      setFirstShown(newStack.length - 1);
    }
  };

  return (
    <div
      ref={drop}
      className="dropTarget"
      style={{ borderColor: isOver ? (canDrop ? 'cyan' : 'red') : 'darkgreen' }}
    >
      {cardIds.length ? (
        <CardStack
          cardIds={cardIds}
          firstShown={firstShown}
          dropCardIds={dropCardIds}
        />
      ) : (
        <Sprite cardId={HUECO} />
      )}
    </div>
  );
};

export default Hueco;
