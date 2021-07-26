import Card from 'Components/Card';
import { REVERSO, tCardId, tMoveCard } from 'datos';
import { sleep } from 'utils';

const SPRITE_ID = 'sprite';

export const CardSprite = ({
  id = SPRITE_ID,
  cardId = REVERSO,
}: {
  id?: string;
  cardId?: tCardId;
}) => <Card id={id} cardId={cardId} className={SPRITE_ID} />;
export default CardSprite;

export const moveCard = async ({
  cardId,
  fromClassName,
  toClassName,
  duration = 200,
  idSprite = SPRITE_ID,
}: tMoveCard): Promise<void> => {
  const fromEl = document.getElementsByClassName(fromClassName)[0];
  if (!fromEl)
    return Promise.reject(
      `Source element with class ${fromClassName} not found`
    );
  const { left: fromX, top: fromY } = fromEl.getBoundingClientRect();

  const toEl = document.getElementsByClassName(toClassName)[0];
  if (!toEl)
    return Promise.reject(`Source element with class ${toClassName} not found`);
  const { left: toX, top: toY } = toEl.getBoundingClientRect();

  const spriteEl = document.getElementById(idSprite) as HTMLImageElement;
  if (!spriteEl)
    return Promise.reject(`Card element with id ${idSprite} not found`);

  spriteEl.src = `assets/cards/${cardId}.svg`;
  spriteEl.style.top = `${fromY}px`;
  spriteEl.style.left = `${fromX}px`;
  spriteEl.style.display = 'inline-block';
  // Mozilla docs suggests allowing a handful of ms after element is displayed
  // before starting transformation
  await sleep(10);
  spriteEl.style.transform = `translate(${toX - fromX}px, ${toY - fromY}px)`;
  spriteEl.style.transition = `transform ${duration}ms ease-in-out`;
  await new Promise<void>((resolve) => {
    const updateTransition = () => {
      spriteEl.removeEventListener('transitionend', updateTransition);
      resolve();
    };
    spriteEl.addEventListener('transitionend', updateTransition, true);
  });
  spriteEl.style.display = 'none';
  spriteEl.style.transform = 'none';
};
