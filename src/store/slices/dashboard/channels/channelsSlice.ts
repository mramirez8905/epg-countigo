import { IChannel, IChannelResponse } from "@/interfaces/channel.interface";
import { IMeta } from "@/interfaces/strapiBase.interface";
import { channelsService } from "@/services/channel.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ChannelState {
  channels: IChannelResponse[];
  meta: IMeta;
  loading: boolean;
  error: string | undefined;
}

const initialState: ChannelState = {
  channels: [],
  meta: {},
  loading: false,
  error: undefined,
};

export const fetchChannel = createAsyncThunk(
  "channel/fetchChannel",
  async (params: any) => {
    const response = await channelsService.get(params);
    return response.data;
  }
);

export const deleteChannel = createAsyncThunk(
  "channel/deleteChannel",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await channelsService.delete(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.error.message);
    }
  }
);

export const updateChannel = createAsyncThunk(
  "channels/updateChannel",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await channelsService.put(params.id, params.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.error.message);
    }
  }
);

export const createChannel = createAsyncThunk(
  "channels/createChannel",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await channelsService.post(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.error.message);
    }
  }
);

const channelSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChannel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchChannel.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.channels = payload.data || [];
      state.meta = payload.meta || {};
    });
    builder.addCase(fetchChannel.rejected, (state, { error }) => {
      state.loading = false;
      state.error = error.message;
    });
    builder.addCase(deleteChannel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteChannel.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(deleteChannel.rejected, (state, { error }) => {
      state.loading = false;
      state.error = error.message;
    });
    builder.addCase(updateChannel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateChannel.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(updateChannel.rejected, (state, { error }) => {
      state.loading = false;
      state.error = error.message;
    });
    builder.addCase(createChannel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createChannel.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(createChannel.rejected, (state, { error }) => {
      state.loading = false;
      state.error = error.message;
    });
  },
});

export const { reducer: channelReducer } = channelSlice;
