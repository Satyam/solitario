import { HUECO, OFFSET_PILA, REVERSO, CardId } from 'datos';
import Sprite from './Sprite';

const CardStack = ({
  cartas,
  lastHidden,
}: {
  cartas: CardId[];
  lastHidden: number;
}) => {
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
