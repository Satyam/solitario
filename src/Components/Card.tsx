import { useRef, useEffect, ImgHTMLAttributes } from 'react';
import type { tCardId } from 'datos';
import { useAppDispatch, saveCoords } from 'store';

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
}: tCardParams) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (className && imgRef.current) {
      const { left, top } = imgRef.current.getBoundingClientRect();
      dispatch(
        saveCoords({
          name: className,
          left: Math.floor(left),
          top: Math.floor(top),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className]);
  return (
    <img
      className={`${className} card`}
      src={`assets/cards/${cardId}.svg`}
      alt={alt || cardId}
      draggable={false}
      ref={imgRef}
      {...params}
    />
  );
};

export default Card;
