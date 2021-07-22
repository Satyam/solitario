import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { tAppDispatch, tRootState } from 'store/store';

export { store } from 'store/store';
export {
  newGameAction,
  jugadaAction,
  restoreMazoAction,
  undoAction,
  redoAction,
  clearUndoAction,
} from 'store/juegoSlice';

export * from 'store/selectors';

export const useAppDispatch = () => useDispatch<tAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<tRootState> = useSelector;

export function useParamSelector<P, R>(
  selector: (state: tRootState, param: P) => R,
  param: P
) {
  return useAppSelector((state) => selector(state, param));
}
