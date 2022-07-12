
import { createReducer, on } from "@ngrx/store";
import { IAppointment } from "../iappointment";
import { loadAppointmentsSuccess } from "./appointments.actions";

export interface appointmentState{
    appointments: IAppointment[]
}

export const initialState: appointmentState = {
    appointments: []
}

export const appointmentReducer = createReducer(
    initialState,
    on(loadAppointmentsSuccess, (state, {data}) => ({...state, appointments: [...data]}))
)