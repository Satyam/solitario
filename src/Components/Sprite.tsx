import type { CardId } from 'datos';
import { OFFSET_PILA } from 'datos';

type spriteParams = {
  cardId: CardId;
  index?: number;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
};

const Sprite = ({ cardId, index = 0, onClick }: spriteParams) => (
  <img
    className="sprite"
    style={{ marginTop: OFFSET_PILA * index, zIndex: 10 + index }}
    src={`assets/cards/${cardId}.svg`}
    alt={cardId}
    onClick={onClick}
  />
);

export default Sprite;
