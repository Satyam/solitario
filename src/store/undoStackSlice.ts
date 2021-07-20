import { createSlice } from '@reduxjs/toolkit';

import {
  newGameAction,
  jugadaAction,
  restoreMazoAction,
  redoAction,
  undoAction,
  UndoStackEntry,
} from 'store/juegoSlice';

export type UndoStackState = {
  current: number;
  stack: UndoStackEntry[];
};

const initialState: UndoStackState = {
  current: -1,
  stack: [],
};

export const undoStackSlice = createSlice({
  name: 'undoStack',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newGameAction, (state, action) => {
        console.log('got newGameAction', action);
        state.stack = [];
        state.current = -1;
      })
      .addCase(jugadaAction, (state, action) => {
        console.log('got jugadaAction', action);
        state.stack.push(action);
        state.current += 1;
      })
      .addCase(restoreMazoAction, (state, action) => {
        console.log('got restoreMazoAction', action);
        state.stack.push(action);
        state.current += 1;
      })
      .addCase(undoAction, (state, action) => {
        console.log('got undoAction', action);
        state.current -= 1;
      })
      .addCase(redoAction, (state, action) => {
        console.log('got redoAction', action);
        state.current += 1;
      });
  },
});

export default undoStackSlice.reducer;
