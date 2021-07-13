import { REVERSO, CardId } from 'datos';
import Sprite from './Sprite';

const CardStack = ({
  cartas,
  firstShown,
  index = 0,
  total = 0,
}: {
  cartas: CardId[];
  firstShown: number;
  index?: number;
  total?: number;
}) => {
  const isLast = cartas.length === 1;
  total = total || cartas.length;
  return (
    <div>
      <div className={isLast ? '' : 'stackedSprite'}>
        <Sprite
          cardId={index >= firstShown ? cartas[cartas.length - 1] : REVERSO}
          index={index}
        />
      </div>
      {isLast ? null : (
        <CardStack
          cartas={cartas.slice(0, -1)}
          firstShown={firstShown}
          index={index + 1}
          total={total}
        />
      )}
    </div>
  );
};

export default CardStack;
