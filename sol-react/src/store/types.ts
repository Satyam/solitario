import { store } from './store';
export * from 'store/juego/types';
export * from 'store/coords/types';
export * from 'store/stats/types';

// Infer the `tRootState` and `tAppDispatch` types from the store itself
export type tRootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type tAppDispatch = typeof store.dispatch;
