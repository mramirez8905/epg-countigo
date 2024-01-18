import { IChannelResponse } from '@/interfaces/channel.interface';
import { IMeta } from '@/interfaces/strapiBase.interface';
import { canalesService } from '@/services/channels.services';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define the initial state
interface CanalesState {
  canales: IChannelResponse[];
  meta: IMeta;
  loading: boolean;
  error?: string;
}

const initialState: CanalesState = {
  canales: [],
  meta: {},
  loading: false,
  error: undefined,
};

// Define the async thunk
export const fetchCanales = createAsyncThunk(
  'canales/fetch',
  async (params: any) => {
    const response = await canalesService.get(params);
    
    return response.data;
  }
);

export const deleteCanales = createAsyncThunk(
  'canales/delete',
  async (id: number) => {
    const response = await canalesService.delete(id);
    return response.data;
  }
);

// Create the slice
const sliceCanales = createSlice({
  name: 'canales',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCanales.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCanales.fulfilled, (state, action) => {
        state.loading = false;
        state.canales = [...action.payload.data];
        state.meta = { ...action.payload.meta };
      })
      .addCase(fetchCanales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCanales.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteCanales.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteCanales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the async thunk and the slice reducer
export const { reducer: canalesReducer } = sliceCanales;
