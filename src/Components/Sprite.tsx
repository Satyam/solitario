import type { CardId } from 'datos';
import { ImgHTMLAttributes } from 'react';

type spriteParams = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  cardId: CardId;
  index?: number;
};

const Sprite = ({
  cardId,
  index = 0,
  className,
  alt,
  ...params
}: spriteParams) => (
  <img
    className={`${className} sprite`}
    src={`assets/cards/${cardId}.svg`}
    alt={alt || cardId}
    {...params}
  />
);

export default Sprite;
