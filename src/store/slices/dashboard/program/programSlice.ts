import { INomenclatorResponse } from '@/interfaces/nomenclador.interface';
import { IProgramResponse } from '@/interfaces/program.interface';
import { IMeta } from '@/interfaces/strapiBase.interface';
import { programService } from '@/services/programs.service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define the initial state
interface ProgramsState {
  programs: IProgramResponse[];
  meta: IMeta;
  loading: boolean;
  error: string | undefined;
}

const initialState: ProgramsState = {
  programs: [],
  meta: {},
  loading: false,
  error: undefined,
};

// Define the async thunk to fetch media
export const fetchPrograms = createAsyncThunk(
  'programs/fetchPrograms',
  async (params: any) => {
    const response = await programService.get(params);
    return response.data;
  }
);

export const deletePrograms = createAsyncThunk(
  'programs/deletePrograms',
  async (id: number) => {
    const response = await programService.delete(id);
    return response.data;
  }
);

const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload.data || [];
        state.meta = action.payload.meta || {};
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Falló al obtener los nomencladores';
      })
      .addCase(deletePrograms.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deletePrograms.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deletePrograms.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Falló al obtener los nomencladores';
      });
  },
});

// Export the async thunk and the media reducer
export const { actions: programsActions, reducer: programsReducer } =
  programsSlice;
