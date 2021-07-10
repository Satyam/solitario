import { HUECO, OFFSET_PILA, REVERSO } from 'datos';
import { useRecoilValue } from 'recoil';
import { cardStackState, lastHiddenState } from 'store/cardStack';
import Sprite from './Sprite';

const CardStack = () => {
  const cartas = useRecoilValue(cardStackState);
  const lastHidden = useRecoilValue(lastHiddenState);
  return cartas.length ? (
    <div className="cardStack">
      {cartas.map((cardId, index) => (
        <Sprite
          key={index}
          cardId={index > lastHidden ? cardId : REVERSO}
          index={index}
          className="stackedSprite"
          style={{
            top: index * OFFSET_PILA,
          }}
        />
      ))}
    </div>
  ) : (
    <Sprite cardId={HUECO} />
  );
};

export default CardStack;
