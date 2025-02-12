import { toast } from '@/hooks/use-toast'; 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 

import axiosInstance, { setAuthToken } from '@/lib/axios'; 

export interface UserData {
  username: string,
  email: string,
  accountType: string,
  id: number;
}
// Defining a TypeScript interface for user data to ensure type safety.

interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}
// Defining the authentication state structure.

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};
// Setting the initial state for authentication.

interface LoginCredentials {
  username: string;
  password: string;
}
// Defining an interface for login credentials.

interface RegisterData {
  username: string;
  email: string;
  password: string;
  accountType: string;
}
// Defining an interface for registration data.

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
      // Simulating the process of loading user data into state.

    } catch (error: any) {
      toast({description: error.response.data.message, variant: 'default'});
      // Displaying an error message if the token loading fails.

      return rejectWithValue('Failed to load token');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/login`, credentials);
      toast({description: response.data.message, variant: 'default'});
      // Showing a success message on login.

      // setAuthToken(response.data.token); // This line is commented out, consider removing if unused.
      window.localStorage.setItem(`token`, response.data.token);
      // Storing the authentication token in local storage.

      return response.data;
    } catch (error: any) {
      toast({description: error.response.data.message, variant: 'destructive'});
      // Displaying an error message if login fails.

      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/register`, userData);
      toast({description: response.data.message, variant: 'default'});
      // Showing a success message when registration is successful.

      return response.data;
    } catch (error: any) {
      toast({description: error.response.data.message, variant: 'destructive'});
      // Displaying an error message if registration fails.

      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      setAuthToken('');
      // Clearing the authentication token.

      window.localStorage.removeItem('token');
      // Removing the token from local storage to log out the user.
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Indicating that the login request is in progress.
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        // Storing the user data upon successful login.
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Storing the error message if login fails.
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Indicating that the registration request is in progress.
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        // Storing the user data upon successful registration.
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Storing the error message if registration fails.
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        state.loading = true;
        state.user = action.payload.user;
        // Updating the user data when the token is loaded successfully.
      })
      .addCase(loadToken.rejected, (state, action) => {
        state.loading = false;
        // Handling the error case for loading a token.
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
