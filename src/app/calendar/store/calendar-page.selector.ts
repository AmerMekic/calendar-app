
import { createSelector } from "@ngrx/store";
import { AppState } from "./app.state";
import { calendarState } from "./calendar-page.reducers";


export const selectDate = (state: AppState) => state.date;

export const loadDate = createSelector(
    selectDate,
    (state: calendarState) => state
)