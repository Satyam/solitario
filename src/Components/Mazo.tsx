import {
  useAppSelector,
  useAppDispatch,
  jugadaAction,
  restoreMazoAction,
  selMazo,
} from 'store';
import { CardId, HUECO, POS, REVERSO } from 'datos';
import Sprite from './Sprite';

const Mazo = () => {
  const dispatch = useAppDispatch();
  const cardIds = useAppSelector<CardId[]>(selMazo);

  const sacar = () => {
    const l = cardIds.length;
    if (l) {
      dispatch(
        jugadaAction({
          cardIds: [cardIds[0]],
          fromPos: POS.MAZO,
          fromSlot: 0,
          toPos: POS.VISTA,
          toSlot: 0,
        })
      );
    } else {
      dispatch(restoreMazoAction());
    }
  };

  return <Sprite cardId={cardIds.length ? REVERSO : HUECO} onClick={sacar} />;
};

export default Mazo;
