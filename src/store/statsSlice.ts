import { createSlice } from '@reduxjs/toolkit';
import { tStatsState } from 'datos';
import {
  newGameAction,
  jugadaAction,
  restoreMazoAction,
} from 'store/juegoSlice';
import { ActionTypes } from 'redux-undo';
const initialState: tStatsState = {
  jugadas: 0,
  rondas: 0,
  undos: 0,
  redos: 0,
};

export const statsSlice = createSlice({
  name: 'contadores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newGameAction, (state) => {
        return initialState;
      })
      .addCase(jugadaAction, (state) => {
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

export default statsSlice.reducer;
