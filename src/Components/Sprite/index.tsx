import type { CardId } from 'datos';

type spriteParams = {
  cardId: CardId;
  x: number;
  y: number;
  index?: number;
};
const Sprite = ({ cardId, x, y, index = 0 }: spriteParams) => (
  <img className="sprite" src={`assets/cards/${cardId}.svg`} alt={cardId} />
);

export default Sprite;
