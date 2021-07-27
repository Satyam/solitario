import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { tAppDispatch, tRootState } from 'store/store';

export * from 'store/store';
export * from 'store/juegoSlice';
export * from 'store/selectors';
export * from 'store/coordsSlice';

export const useAppDispatch = () => useDispatch<tAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<tRootState> = useSelector;

export function useParamSelector<P, R>(
  selector: (state: tRootState, param: P) => R,
  param: P
) {
  return useAppSelector((state) => selector(state, param));
}

export * from 'store/asyncActions';
