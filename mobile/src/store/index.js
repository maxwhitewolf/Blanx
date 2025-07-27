import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});
