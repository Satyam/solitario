import Card from 'Components/Card';
import { REVERSO, tCardId, SPRITE_ID } from 'datos';

const CardSprite = ({
  id = SPRITE_ID,
  cardId = REVERSO,
}: {
  id?: string;
  cardId?: tCardId;
}) => <Card id={id} cardId={cardId} className={SPRITE_ID} />;

export default CardSprite;
