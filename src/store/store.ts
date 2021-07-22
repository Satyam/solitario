import { configureStore } from '@reduxjs/toolkit';
import juegoReducer from 'store/juegoSlice';

export const store = configureStore({
  reducer: {
    juego: juegoReducer,
  },
});

// Infer the `tRootState` and `tAppDispatch` types from the store itself
export type tRootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type tAppDispatch = typeof store.dispatch;
