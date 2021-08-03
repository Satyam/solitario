import { createSlice } from '@reduxjs/toolkit';
import { ActionTypes } from 'redux-undo';
import { newGameAction, takeFrom, restoreMazoAction } from 'store/juego';
import type { tStatsState } from './types';
import type { tRootState } from 'store/types';

const initialState: tStatsState = {
  jugadas: 0,
  rondas: 0,
  undos: 0,
  redos: 0,
};

const statsSlice = createSlice({
  name: 'contadores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newGameAction, (state) => {
        return initialState;
      })
      .addCase(takeFrom, (state) => {
        state.jugadas += 1;
      })
      .addCase(restoreMazoAction, (state) => {
        state.jugadas += 1;
        state.rondas += 1;
      })
      .addCase(ActionTypes.UNDO, (state) => {
        state.jugadas += 1;
        state.undos += 1;
      })
      .addCase(ActionTypes.REDO, (state) => {
        state.jugadas += 1;
        state.redos += 1;
      });
  },
});

export const selStats = (state: tRootState) => state.stats;

export default statsSlice.reducer;
