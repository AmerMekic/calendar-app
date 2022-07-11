import { Component, OnInit } from '@angular/core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { loadDate } from '../store/calendar-page.selector';
import { loadAllAppointments } from '../store/appointment.selector';
import { loadAppointments } from '../store/appointments.actions';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent{
  currentDate$ = this.store.pipe(select(loadDate))
  leftArrow = faAngleLeft;
  rightArrow = faAngleRight;
  months: string[] = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
  ];
  
  constructor(protected store: Store<AppState>){}
}
