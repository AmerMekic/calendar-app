import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap } from "rxjs";
import * as calendarPageActions from './calendar-page.actions'
@Injectable()
export class CalendarEffects {

    constructor(private actions$: Actions){}

    setWeeks$ = createEffect(() => this.actions$.pipe(
        ofType(calendarPageActions.setDate),
        switchMap((date) => {
            return [calendarPageActions.setWeek(date)]
        })
    ))
}