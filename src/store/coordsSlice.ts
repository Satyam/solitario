import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tCoordsState, tCoordsAction } from 'datos';

const initialState: tCoordsState = {};

export const coordsSlice = createSlice({
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
export default coordsSlice.reducer;
