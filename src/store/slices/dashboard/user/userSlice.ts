import { usersService } from '@/services/user.service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface UserState {
  users: IUser[];
  loading: boolean;
  error: string | undefined;
};

const initialState: UserState = {
  users: [],
  loading: false,
  error: undefined
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await usersService.getUsers(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await usersService.delete(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await usersService.put(params.id, params.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await usersService.post(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users = payload || [];
    });
    builder.addCase(fetchUsers.rejected, (state, { error }) => {
      state.loading = false;
      state.error = error.message;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(deleteUser.rejected, (state, { error }) => {
      state.loading = false;
      state.error = error.message;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      
    });
    builder.addCase(updateUser.rejected, (state, { error }) => {
      state.loading = false;
      state.error = error.message;
    });
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createUser.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(createUser.rejected, (state, { error }) => {
      state.loading = false;
      state.error = error.message;
    });
  },
});

export const {reducer: userReducer} = userSlice