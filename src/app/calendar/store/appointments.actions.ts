import { createAction, props } from "@ngrx/store";
import { IAppointment } from "../iappointment";

export const loadAppointments = createAction(
    '[Calendar Page] Load Appointments'
)
export const loadAppointmentsSuccess = createAction(
    '[Calendar Page] Load Appointments Success',
    props<{data: IAppointment[]}>()
)  
export const loadAppointmentError = createAction(
    '[Calendar Page] Load Appointments Error'
)