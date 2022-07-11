import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { getDay, getDaysInMonth, getWeekOfMonth } from 'date-fns';
import { setDate } from '../store/calendar-page.actions';
import { CalendarPageComponent } from '../calendar-page/calendar-page.component';
import { IDay } from '../iday';
import { getPrevMonth, getNextMonth } from '../calendar-functions';
import { loadAppointments } from '../store/appointments.actions';
import { Subscription } from 'rxjs';
import { loadAllAppointments } from '../store/appointment.selector';
import { select } from '@ngrx/store';
import { IAppointment } from '../iappointment';
@Component({
  selector: 'side-calendar',
  templateUrl: './side-calendar.component.html',
  styleUrls: ['./side-calendar.component.scss']
})
export class SideCalendarComponent extends CalendarPageComponent implements OnInit, OnChanges, OnDestroy {
  appointmentSub!: Subscription;
  appointments$ = this.store.pipe(select(loadAllAppointments));
  allAppointments: IAppointment[] = [];
  @Input() currentDay: number = 0;
  @Input() currentMonth: number = 0;
  @Input() currentYear: number = 0;
  week: number[] = [];
  days: IDay[] = [];
  weekDays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  ngOnInit(): void {
    this.store.dispatch(loadAppointments());
    this.appointmentSub = this.appointments$.subscribe((data: IAppointment[]) => {
      this.allAppointments = data;
      this.getCurrentWeek();
      this.populateDays();
    })
    
  }

  ngOnChanges(): void{
    this.getCurrentWeek();
    this.populateDays();
  }

  ngOnDestroy(): void {
    this.appointmentSub.unsubscribe;
  }

  private populateDays():void {
     
      const monthStartDay = getDay(new Date(this.currentYear, this.currentMonth, 1));
      
      let previousMonthEndDay = getDaysInMonth(getPrevMonth(this.currentMonth, this.currentYear));
      this.days = [];
      let previousMonthDays = previousMonthEndDay - (monthStartDay - 1)
      let currentMonthDays = 1;
      let nextMonthDays = 1;

      for(let i = 0; i < 42; i++){ 
        
        if(i < monthStartDay){

          this.days.push({day: previousMonthDays++, month: this.currentMonth-1, year: this.currentYear})
        }
        else if(currentMonthDays > getDaysInMonth(new Date(this.currentYear, this.currentMonth))){

          this.days.push({day: nextMonthDays++, month: this.currentMonth+1, year: this.currentYear})
        }
        else{

          this.days.push({day: currentMonthDays++, month: this.currentMonth, year: this.currentYear})
        }
      }
  }

  public handlePrevMonth(value: number = 1):void {  
    
    let day = value;
    let month = this.currentMonth - 1 === -1 ? 11 : this.currentMonth-1;
    let year = month === 11 ? this.currentYear - 1 : this.currentYear;
    
    this.store.dispatch(setDate({date:{day:day, month: month, year:year}}))
  }

  public handleNextMonth(value: number = 1):void {
      let day = value;
      let month = this.currentMonth + 1 === 12 ? 0 : this.currentMonth + 1;
      let year = month === 0 ? this.currentYear + 1 : this.currentYear;
      this.store.dispatch(setDate({date:{day:day, month: month, year:year}}))
  }

  private getCurrentWeek():void{

    this.week = [];
      let weekNumber = getWeekOfMonth(new Date(this.currentYear, this.currentMonth, this.currentDay));
      let start = (7*weekNumber) - 7;
      for(let i = start; i < (7*weekNumber); i++){
        this.week.push(i)
      }
  }

  public getCurrentDayClass(day: IDay, index: number) :string{
    if(day.month === this.currentMonth){

      if(day.day === this.currentDay){
        return 'current-active'
      }
      else if(this.week.includes(index)){

        return 'current-active-week'
      }
      else{

        return 'current';
      }
    }
    else{

      if(this.week.includes(index)){

        return 'not-current-active-week'
      }
      else{

        return 'not-current'
      }
    }
  }

  handleDayClick(day: IDay): void{
    let clickedDay = day.day;
    if(day.month > this.currentMonth){

      this.handleNextMonth(clickedDay);
    }
    else if(day.month < this.currentMonth){

      this.handlePrevMonth(clickedDay);
    }
    else{
      
      this.store.dispatch(setDate({date:{day: clickedDay, month: this.currentMonth, year: this.currentYear}}))
    }
    this.getCurrentWeek();
  }

  public isThereAnAppointment(value: IDay):boolean{
    let thereIs = false;
    let i = 0;
    while (i < this.allAppointments.length){
      if(value.day === this.allAppointments[i].date.getDate() && value.month === this.allAppointments[i].date.getMonth()){
        thereIs = true;
        break;
      }
      i++;
    }
    return thereIs;
  }
}
