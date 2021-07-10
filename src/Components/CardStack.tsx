import { HUECO, OFFSET_PILA, REVERSO, CardId } from 'datos';
import Sprite from './Sprite';

const CardStack = ({
  cartas,
  firstShown,
}: {
  cartas: CardId[];
  firstShown: number;
}) => {
  return cartas.length ? (
    <div className="cardStack">
      {cartas.map((cardId, index) => (
        <Sprite
          key={index}
          cardId={index >= firstShown ? cardId : REVERSO}
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
