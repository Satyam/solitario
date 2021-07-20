import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store/store';

export { store } from 'store/store';
export {
  newGameAction,
  jugadaAction,
  restoreMazoAction,
} from 'store/juegoSlice';
export { selHasWon, selPilaToSendCard } from 'store/selectors';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
