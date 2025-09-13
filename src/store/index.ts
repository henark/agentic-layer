import { configureStore } from '@reduxjs/toolkit';
import agentReducer from './agentSlice';
import taskReducer from './taskSlice';

export const store = configureStore({
  reducer: {
    agent: agentReducer,
    tasks: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
