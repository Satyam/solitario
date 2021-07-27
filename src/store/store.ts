import { configureStore } from '@reduxjs/toolkit';
import juegoReducer from 'store/juegoSlice';
import statsReducer from './statsSlice';
import coordsSlice from './coordsSlice';
export const store = configureStore({
  reducer: {
    juego: juegoReducer,
    stats: statsReducer,
    coords: coordsSlice,
  },
});

// Infer the `tRootState` and `tAppDispatch` types from the store itself
export type tRootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type tAppDispatch = typeof store.dispatch;
