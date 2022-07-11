import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { AppointmentsService } from "../appointments.service";
import { IAppointment } from "../iappointment";
import { loadAppointmentError, loadAppointments, loadAppointmentsSuccess } from "./appointments.actions";

 @Injectable()
 export class AppointmentEffects{
    
    constructor(private actions$: Actions, private appointmentService: AppointmentsService){}
    
    loadAppointments$ = createEffect(() => this.actions$.pipe(
        ofType(loadAppointments),
        mergeMap(() => this.appointmentService.getAppointments().pipe(
            map((appointments: IAppointment[]) => {
                return loadAppointmentsSuccess({data: appointments})
            }),
            catchError(() => of(loadAppointmentError()))
        ))
    ))

 }