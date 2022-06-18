import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { tAppDispatch, tRootState } from 'store/types';

export * from 'store/store';
export * from 'store/juego';
export * from 'store/coords';
export * from 'store/stats';

export const useAppDispatch = () => useDispatch<tAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<tRootState> = useSelector;

export function useParamSelector<P, R>(
  selector: (state: tRootState, param: P) => R,
  param: P
) {
  return useAppSelector((state) => selector(state, param));
}
