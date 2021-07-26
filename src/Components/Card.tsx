import type { tCardId } from 'datos';
import { ImgHTMLAttributes } from 'react';

type tCardParams = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  cardId: tCardId;
  index?: number;
};

const Card = ({
  cardId,
  index = 0,
  className,
  alt,
  ...params
}: tCardParams) => (
  <img
    className={`${className} card`}
    src={`assets/cards/${cardId}.svg`}
    alt={alt || cardId}
    draggable={false}
    {...params}
  />
);

export default Card;
