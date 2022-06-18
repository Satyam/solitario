import { configureStore } from '@reduxjs/toolkit';
import juego from 'store/juego';
import stats from 'store/stats';
import coords from 'store/coords';

export const store = configureStore({
  reducer: {
    juego,
    stats,
    coords,
  },
});
