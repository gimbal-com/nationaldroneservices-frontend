import { toast } from '@/hooks/use-toast'; 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 

import axiosInstance, { setAuthToken } from '@/lib/axios'; 

export interface UserData {
  username: string,
  email: string,
  accountType: string,
  id: number;
  certs?: { user_id: number, path: string }[]
}

// Defining the authentication state structure.
interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

// Setting the initial state for authentication.
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

// Defining an interface for login credentials.
interface LoginCredentials {
  username: string;
  password: string;
}

// Defining an interface for registration data.
interface RegisterData {
  username: string;
  email: string;
  password: string;
  accountType: string;
}

export const loadToken = createAsyncThunk(
  'auth/loadToken',
  async ({ username, email, accountType, id }: { username: string; email: string; accountType: string, id: number }, { rejectWithValue }) => {
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
      // Displaying an error message if the token loading fails.
      toast({description: error.response.data.message, variant: 'default'});
      return rejectWithValue('Failed to load token');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/login`, credentials);
      // Showing a success message on login.
      toast({description: response.data.message, variant: 'default'});
      // setAuthToken(response.data.token); 

      // Storing the authentication token in local storage.
      window.localStorage.setItem(`token`, response.data.token);

      return response.data;
    } catch (error: any) {
      // Displaying an error message if login fails.
      toast({description: error.response.data.message, variant: 'destructive'});
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/register`, userData);
      // Showing a success message when registration is successful.
      toast({description: response.data.message, variant: 'default'});
      return response.data;
    } catch (error: any) {
      // Displaying an error message if registration fails.
      toast({description: error.response.data.message, variant: 'destructive'});
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPilotCerts = createAsyncThunk('auth/getPilotCerts', async (userId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/pilot/profile?userId=${userId}`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response.data);
  }
})

export const uploadPilotCertificates = createAsyncThunk('jobs/uploadFiles', async ({ userId, files }: { userId: number, files: File[] }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`api/pilot/profile/certs?userId=${userId}`, files);
    toast({description: response.data.message, variant: 'default'});
    return response.data;
  } catch (err: any) {
    toast({description: err.response.data.message, variant: 'destructive'});
    return rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      // Clearing the authentication token.
      setAuthToken('');
      // Removing the token from local storage to log out the user.
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
        state.user = action.payload.user; // Storing the user data upon successful login.
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
        state.user = action.payload.user; // Storing the user data upon successful registration.
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        state.loading = true;
        state.user = action.payload.user;  // Updating the user data when the token is loaded successfully when reload the page.
      })
      .addCase(loadToken.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getPilotCerts.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.certs = action.payload.certs;
        }
      })
      .addCase(uploadPilotCertificates.fulfilled, (state, action) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
