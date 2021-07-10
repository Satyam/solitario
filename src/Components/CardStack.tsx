import { HUECO, OFFSET_PILA, REVERSO, CardId, CARTA_HEIGHT } from 'datos';
import Sprite from './Sprite';

const CardStack = ({
  cartas,
  firstShown,
}: {
  cartas: CardId[];
  firstShown: number;
}) => {
  const l = cartas.length;
  return l ? (
    <div
      className="cardStack"
      style={{ height: OFFSET_PILA * l + CARTA_HEIGHT }}
    >
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
