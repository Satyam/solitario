import { configureStore } from '@reduxjs/toolkit';
import juegoReducer from 'store/juegoSlice';
import undoStackReducer from 'store/undoStackSlice';

export const store = configureStore({
  reducer: {
    juego: juegoReducer,
    undo: undoStackReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
