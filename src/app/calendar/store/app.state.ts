import { appointmentState } from "./appointment.reducers";
import { calendarState } from "./calendar-page.reducers";

export interface AppState{
    date: calendarState,
    appointment: appointmentState
}