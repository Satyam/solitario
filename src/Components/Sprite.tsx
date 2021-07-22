import type { tCardId } from 'datos';
import { ImgHTMLAttributes } from 'react';

type tSpriteParams = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  cardId: tCardId;
  index?: number;
};

const Sprite = ({
  cardId,
  index = 0,
  className,
  alt,
  ...params
}: tSpriteParams) => (
  <img
    className={`${className} sprite`}
    src={`assets/cards/${cardId}.svg`}
    alt={alt || cardId}
    draggable={false}
    {...params}
  />
);

export default Sprite;
