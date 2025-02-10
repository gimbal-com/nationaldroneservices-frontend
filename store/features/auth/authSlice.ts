import { API_SERVER_URL } from '@/store/key';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  type: string;
}

export const loadToken = createAsyncThunk('auth/loadToken', async ({ username, email, accountType, token }: { username: string; email: string; accountType: string, token: string }, { rejectWithValue }) => {
  try {
    const payload = {
      user: {
        username,
        email,
        accountType
      },
      token: token
    };
    return payload;

  } catch (error: any) {
    return rejectWithValue('Failed to load token');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_SERVER_URL}/api/login`, credentials);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk('auth/register', async (userData: RegisterData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_SERVER_URL}/api/register`, userData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      window.localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        window.localStorage.setItem(`token`, action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        state.loading = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loadToken.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;