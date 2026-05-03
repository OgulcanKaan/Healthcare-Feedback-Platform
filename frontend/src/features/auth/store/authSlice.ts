import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/shared/models/auth";
import { clearAuthStorage, getStoredToken, getStoredUser, setStoredToken, setStoredUser } from "@/shared/utils/storage";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

const initialState: AuthState = {
  token: getStoredToken(),
  user: getStoredUser()
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      setStoredToken(action.payload.token);
      setStoredUser(action.payload.user);
    },
    signOut(state) {
      state.token = null;
      state.user = null;
      clearAuthStorage();
    }
  }
});

export const { setCredentials, signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
