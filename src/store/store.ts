import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './auth/authSlice';
import { canalesReducer } from './slices/dashboard/canales/sliceCanales';
import { channelReducer } from './slices/dashboard/channels/channelsSlice';
import { nomenclatorsReducer } from './slices/dashboard/nomenclators/nomenclatorsSlice';
import { playListReducer } from './slices/dashboard/playlist/slicePlaylist';
import { programsReducer } from './slices/dashboard/program/programSlice';
import { scheduleReducer } from './slices/dashboard/schedule/scheduleSlice';
import { userReducer } from './slices/dashboard/user/userSlice';

const store = configureStore({
  reducer: {
    canales: canalesReducer,
    channels: channelReducer,
    playlists: playListReducer,
    user: userReducer,
    nomenclator: nomenclatorsReducer,
    programs: programsReducer,
    auth: AuthReducer,
    schedule: scheduleReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: Co
export type AppDispatch = typeof store.dispatch;

export default store