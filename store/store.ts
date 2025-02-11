import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import jobReducer from './features/jobs/jobSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;