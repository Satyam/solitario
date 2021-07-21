import { configureStore, Middleware } from '@reduxjs/toolkit';
import { POS } from 'datos';
import juegoReducer, { jugadaAction } from 'store/juegoSlice';
import undoStackReducer from 'store/undoStackSlice';

const logger: Middleware =
  ({ getState }) =>
  (next) =>
  (action) => {
    console.log('will dispatch', action);

    if (
      action.type === jugadaAction.type &&
      action.payload.fromPos === POS.HUECO
    ) {
      action.payload.firstShown =
        getState().juego.huecos[action.payload.fromSlot].firstShown;
    }
    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    console.log('state after dispatch', getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };

export const store = configureStore({
  reducer: {
    juego: juegoReducer,
    undo: undoStackReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
