import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IMeta } from '@/interfaces/strapiBase.interface';
import { playListService } from '@/services/playlist.service';
import { IPlayListResponse } from '@/interfaces/playlist.interface';

// Define the initial state
interface PlayListState {
  playlists: IPlayListResponse[];
  meta: IMeta;
  loading: boolean;
  error: string | undefined;
  singlePlayList?: IPlayListResponse
}

const initialState: PlayListState = {
  playlists: [],
  meta: {},
  loading: false,
  error: undefined,
  singlePlayList: undefined
};

// Define the async thunk to fetch media
export const fetchPlayList = createAsyncThunk(
  'playlist/fetchPlayList',
  async (params: any) => {
    const response = await playListService.get(params);
    return response.data;
  }
);

export const fetchPlayListById = createAsyncThunk('playlist/fetchPlayListById',async (payload: any) => {
  const response = await playListService.getById(payload.id, payload.params)
  return response.data.data
});

export const createPlayList = createAsyncThunk(
  'playlist/createPlayList',
  async (payload: any) => {
    const response = await playListService.post(payload);
    return response.data;
  }
);

export const deletePlayList = createAsyncThunk(
  'playlist/deletePlayList',
  async (id: number) => {
    const response = await playListService.delete(id);
    return response.data;
  }
);

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayList.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchPlayList.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload.data;
        state.meta = { ...action.payload.meta };
      })
      .addCase(fetchPlayList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falló al obtener las playlist';
      })
      .addCase(deletePlayList.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deletePlayList.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deletePlayList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falló al obtener las playlist';
      })
      .addCase(fetchPlayListById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchPlayListById.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePlayList = action.payload
      })
      .addCase(fetchPlayListById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falló al obtener la playlist';
      })
      .addCase(createPlayList.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createPlayList.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists.push(action.payload.data);
      })
      .addCase(createPlayList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falló al crear la playlist';
      });
  },
});

// Export the async thunk and the media reducer
export const { actions: playlistActions, reducer: playListReducer } = playlistSlice;
