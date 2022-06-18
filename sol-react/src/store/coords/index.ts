import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tRootState } from 'store/types';
import { tCoordsState, tCoordsAction } from './types';

const initialState: tCoordsState = {};

const coordsSlice = createSlice({
  name: 'coordinates',
  initialState,
  reducers: {
    saveCoords: (
      state: tCoordsState,
      { payload: { name, left, top } }: PayloadAction<tCoordsAction>
    ) => {
      state[name] = {
        left,
        top,
      };
    },
  },
});

export const { saveCoords } = coordsSlice.actions;

export const selCoords = (state: tRootState, name: string) =>
  state.coords[name];

export default coordsSlice.reducer;
