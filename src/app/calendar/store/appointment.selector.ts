import { createSelector } from "@ngrx/store";
import { AppState } from "./app.state";
import { appointmentState } from "./appointment.reducers";

export const selectAppointment = (state: AppState) => state.appointment

export const loadAllAppointments = createSelector(
    selectAppointment,
    (state: appointmentState) => state.appointments
)