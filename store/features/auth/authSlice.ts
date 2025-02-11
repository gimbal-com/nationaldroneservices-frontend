import { toast } from '@/hooks/use-toast';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, { setAuthToken } from '@/lib/axios';

export interface UserData {
  username: string,
  email: string,
  accountType: string
  id: number;
}
interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  accountType: string;
}

export const loadToken = createAsyncThunk('auth/loadToken', async ({ username, email, accountType, id }: { username: string; email: string; accountType: string, id: number }, { rejectWithValue }) => {
  try {
    const payload = {
      user: {
        username,
        email,
        accountType,
        id
      }
    };
    return payload;

  } catch (error: any) {
    toast({description: error.response.data.message, variant: 'default'});
    
    return rejectWithValue('Failed to load token');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/login`, credentials);
    toast({description: response.data.message, variant: 'default'});
    // setAuthToken(response.data.token);
    window.localStorage.setItem(`token`, response.data.token);
    
    return response.data;
  } catch (error: any) {
    toast({description: error.response.data.message, variant: 'destructive'});
    return rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk('auth/register', async (userData: RegisterData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/register`, userData);
    toast({description: response.data.message, variant: 'default'});
    return response.data;
  } catch (error: any) {
    toast({description: error.response.data.message, variant: 'destructive'});
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      setAuthToken('');
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
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        state.loading = true;
        state.user = action.payload.user;
      })
      .addCase(loadToken.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;