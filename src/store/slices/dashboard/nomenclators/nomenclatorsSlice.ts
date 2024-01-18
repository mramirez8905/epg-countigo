import { INomenclatorResponse } from '@/interfaces/nomenclador.interface';
import { IMeta } from '@/interfaces/strapiBase.interface';
import { nomenclatorService } from '@/services/nomenclator.service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define the initial state
interface NomenclatorsState {
  nomenclators: INomenclatorResponse[];
  meta: IMeta;
  loading: boolean;
  error: string | undefined;
}

const initialState: NomenclatorsState = {
  nomenclators: [],
  meta: {},
  loading: false,
  error: undefined,
};

// Define the async thunk to fetch media
export const fetchNomenclators = createAsyncThunk(
  'playlist/fetchNomenclators',
  async (params: any) => {
    const response = await nomenclatorService.get(params);
    return response.data;
  }
);


const nomenclatorsSlice = createSlice({
  name: 'nomenclators',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNomenclators.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchNomenclators.fulfilled, (state, action) => {
        state.loading = false;
        state.nomenclators = action.payload.data || [];
        state.meta = action.payload.meta || {};
      })
      .addCase(fetchNomenclators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falló al obtener los nomencladores';
      })
  },
});

// Export the async thunk and the media reducer
export const { actions: nomenclatorsActions, reducer: nomenclatorsReducer } =
  nomenclatorsSlice;
