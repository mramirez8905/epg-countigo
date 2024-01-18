import { axiosInstance } from '@/boot/axios';
import { IScheduleResponse } from '@/interfaces/schedule.interface';
import { IMeta } from '@/interfaces/strapiBase.interface';
import { scheduleService } from '@/services/schedule.service';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Define the initial state
interface ScheduleState {
  schedules: IScheduleResponse[];
  loading: boolean;
  error: string | undefined;
  meta?: IMeta;
}

const initialState: ScheduleState = {
  schedules: [],
  loading: false,
  error: undefined,
  meta: {} 
};

// Define the fetch method
export const fetchSchedules = createAsyncThunk(
  'schedule/fetchSchedule',
  async (params: any) => {
      const response = await scheduleService.get(params);
      return response.data;
  }
);


// Create the schedule slice
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload.data || [];
        state.meta = action.payload.meta || {};
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Falló al obtener las programaciones';
      });
  },
});

// Export the actions and reducer
export const { actions: scheduleActions, reducer: scheduleReducer } = scheduleSlice;
