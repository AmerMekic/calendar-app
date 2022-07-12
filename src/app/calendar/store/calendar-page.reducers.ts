import { createReducer, on } from "@ngrx/store";
import * as CalendarPageActions from './calendar-page.actions';
import { setWeek } from "../calendar-functions";
import { IDay } from "../iday";


export interface calendarState{
    day: number,
    month: number, 
    year: number,
    week: IDay[];
}


export const initialState: calendarState = {
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    week: setWeek({day: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear()})

}

export const dateReducer = createReducer(
    initialState,
    on(CalendarPageActions.setDate, ( state, {date} ) => {
        return {...state, day: date.day, month: date.month, year: date.year}
    }),

    on(CalendarPageActions.setWeek, ( state, {date} ) => {
        return {...state, day: date.day, month: date.month, year: date.year, week: setWeek(date)}
    })
)


