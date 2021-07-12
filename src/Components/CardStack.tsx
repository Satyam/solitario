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
      {cartas.map((cardId, index) => {
        const i = l - index;
        return (
          <Sprite
            key={i}
            cardId={i > firstShown ? cardId : REVERSO}
            index={index}
            className="stackedSprite"
            style={{
              top: i * OFFSET_PILA,
              zIndex: i,
            }}
          />
        );
      })}
    </div>
  ) : (
    <Sprite cardId={HUECO} />
  );
};

export default CardStack;
