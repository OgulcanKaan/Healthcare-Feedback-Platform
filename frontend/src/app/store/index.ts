import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/store/authSlice";
import { dashboardFiltersReducer } from "@/features/dashboard/store/dashboardFiltersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboardFilters: dashboardFiltersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
