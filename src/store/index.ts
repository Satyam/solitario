import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store/store';

export { store } from 'store/store';
export {
  newGameAction,
  jugadaAction,
  restoreMazoAction,
  undoAction,
  redoAction,
} from 'store/juegoSlice';

export * from 'store/selectors';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type SlotSelector<P, R> = (state: RootState, param: P) => R;

export function useParamSelector<P, R>(selector: SlotSelector<P, R>, param: P) {
  return useAppSelector((state) => selector(state, param));
}
