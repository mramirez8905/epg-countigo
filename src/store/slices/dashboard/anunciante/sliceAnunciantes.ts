import { IAnunciantesResponse } from '@/interfaces/anunciantes.interface';
import { IMeta } from '@/interfaces/strapiBase.interface';
import { anunciantesService } from '@/services/anunciantes.service';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the initial state
interface AnunciantesState {
  anunciantes: IAnunciantesResponse[];
  meta: IMeta;
  loading: boolean;
  error: string | undefined;
}

const initialState: AnunciantesState = {
  anunciantes: [],
  meta: {},
  loading: false,
  error: undefined,
};

// Define the async thunk
export const fetchAnunciantes = createAsyncThunk(
  'anunciantes/fetch',
  async (params: any) => {
    const response = await anunciantesService.get(params);
    return response.data;
  }
);

export const deleteAnunciantes = createAsyncThunk(
  'anunciantes/delete',
  async (id: number) => {
    const response = await anunciantesService.delete(id);
    return response.data;
  }
);

// Create the slice
const sliceAnunciantes = createSlice({
  name: 'anunciantes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnunciantes.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAnunciantes.fulfilled, (state, action) => {
        state.loading = false;
        state.anunciantes = [...action.payload.data];
        state.meta = { ...action.payload.meta };
      })
      .addCase(fetchAnunciantes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteAnunciantes.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteAnunciantes.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteAnunciantes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the async thunk and the slice reducer
export const { reducer: anunciantesReducer } = sliceAnunciantes;
