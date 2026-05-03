import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DashboardFiltersState {
  startDate: string;
  endDate: string;
}

const today = new Date();
const monthAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

function toInputDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const initialState: DashboardFiltersState = {
  startDate: toInputDate(monthAgo),
  endDate: toInputDate(today)
};

const dashboardFiltersSlice = createSlice({
  name: "dashboardFilters",
  initialState,
  reducers: {
    setDateRange(state, action: PayloadAction<DashboardFiltersState>) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    }
  }
});

export const { setDateRange } = dashboardFiltersSlice.actions;
export const dashboardFiltersReducer = dashboardFiltersSlice.reducer;
