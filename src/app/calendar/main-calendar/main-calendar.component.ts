import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { getDay, getDaysInMonth } from 'date-fns';
import { setDate } from '../store/calendar-page.actions';
import { CalendarPageComponent } from '../calendar-page/calendar-page.component';
import { getPrevMonth, getNextMonth } from '../calendar-functions';
import { IAppointment } from '../iappointment';
import { Subscription } from 'rxjs';
import { select } from '@ngrx/store';
import { loadAllAppointments } from '../store/appointment.selector';
import { loadAppointments } from '../store/appointments.actions';
import { IDay } from '../iday';
import { IHour } from '../ihour';
@Component({
  selector: 'main-calendar',
  templateUrl: './main-calendar.component.html',
  styleUrls: ['./main-calendar.component.scss']
})
export class MainCalendarComponent extends CalendarPageComponent implements OnInit, OnChanges, OnDestroy{
  showAppointmentPopup: boolean = false;
  hours: IHour[] = [];
  appointmentSub: Subscription = new Subscription;
  appointments$ = this.store.pipe(select(loadAllAppointments))
  allAppointments: IAppointment[] = [];
  weekAppointments: IAppointment[] = [];
  clickedAppointments!: IHour
  @Input() currentDay: number = 0;  
  @Input() currentMonth: number = 0
  @Input() currentYear: number = 0
  @Input() week: IDay[] = [];

  date: string =  '';
  weekDayNames: string[] = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
  ];

  ngOnInit(): void {
    this.store.dispatch(loadAppointments());
    this.appointmentSub = this.appointments$.subscribe((data: IAppointment[]) => {
      this.allAppointments = data;
      this.weekAppointments = this.getWeekAppointments(this.allAppointments)
      this.populateHours();
      this.date = this.setMainCalendarTitle();
      let sortArray = [...this.allAppointments];
      sortArray = sortArray.sort((a: IAppointment, b: IAppointment) => a.date.getTime() - b.date.getTime())
      sortArray = sortArray.map((appointment: IAppointment, index: number) => {
        return appointment = {...appointment, index: index}
      })
      this.allAppointments = [...sortArray]
    })
    
    
  }
  
  ngOnChanges(): void {
    
    this.date = this.setMainCalendarTitle();
    this.weekAppointments = this.getWeekAppointments(this.allAppointments);
    this.populateHours();
  }

  ngOnDestroy(): void {

    this.appointmentSub.unsubscribe();
  }



  public handleNextWeek() :void{
      let day = this.currentDay;
      let nextWeekDay = this.week[6].day + 1;
      let month = this.currentMonth;
      let year = this.currentYear;

      let currentMonthDays = getDaysInMonth(new Date(month, year));

      if(nextWeekDay <= 7 && day > 7){
        month = getNextMonth(month, year).getMonth();
        year = getNextMonth(month, year).getFullYear();
        this.store.dispatch(setDate({date:{day: nextWeekDay, month: month, year: year}}))
      }
      else if(nextWeekDay >= currentMonthDays){
  
        nextWeekDay = 1;
        month = getNextMonth(month, year).getMonth();
        year = getNextMonth(month, year).getFullYear();
        this.store.dispatch(setDate({date:{day: nextWeekDay, month: month, year: year}}))
      }
      else{
        this.store.dispatch(setDate({date:{day: nextWeekDay, month: month, year: year}}))
      }
      
  }

  public handlePrevWeek():void{

      let day = this.currentDay;
      let month = this.currentMonth;
      let year = this.currentYear;
      let prevWeekDay  = this.week[6].day - 13;
      let prevMonthNumberOfDays = getDaysInMonth(getPrevMonth(month, year));
      let currentMonthNumberOfDays = getDaysInMonth(new Date(year, month))
      
      if(prevWeekDay <= 0 && day < 7){

        prevWeekDay = prevMonthNumberOfDays + prevWeekDay;
        month = getPrevMonth(month, year).getMonth();
        year = getPrevMonth(month, year).getFullYear();
        this.store.dispatch(setDate({date:{day: prevWeekDay, month: month, year: year}}));
      }
      else if(prevWeekDay <= 0 && day > 7){

        prevWeekDay = currentMonthNumberOfDays + prevWeekDay;
        this.store.dispatch(setDate({date:{day: prevWeekDay, month: month, year: year}}));
      }
      else{

        this.store.dispatch(setDate({date:{day: prevWeekDay, month: month, year: year}}));
      }
      
  }

  private populateHours():void{
    this.hours = [];
    let startHour = 8;
    let endHour = startHour;
    let startWeekDay = 0;
    for(let i = 0; i < 104; i++){
      
      if(i % 8 === 0){
        
        this.hours.push({
          name: startHour.toString() + ':00', 
          startHour: startHour,
          endHour: endHour++,
          day: -1,
          month: 0,
          year: 0,
          weekDay: 0, 
          appointments: []})
        startHour++;
      }
      else{

        this.hours.push({
          name: '', 
          startHour: startHour-1,
          endHour: endHour,
          day: this.week[startWeekDay].day,
          month: this.week[startWeekDay].month,
          year: this.week[startWeekDay].year,
          weekDay: (i%8) - 1, 
          appointments: []})

          startWeekDay = startWeekDay + 1 === 7 ? 0 : startWeekDay + 1;
      }

      this.weekAppointments.forEach((data: IAppointment) => {

        if(this.hours[i].startHour === data.date.getHours() && this.hours[i].weekDay === getDay(data.date)){
          this.hours[i].appointments.push(data)
          this.weekAppointments = this.weekAppointments.filter((appointmentData) => appointmentData.id !== data.id)
        }
      })
      
      
    }
  }

  public getClass(i: number):string{
    if(i % 8 === 0){

      return 'hour'
    }
    else if(i % 8 === 7){

      return 'end'
    }
    else{

      return ''
    }
  }

  public getActiveDayClass(i: number):string{
    if(this.week[i].day === this.currentDay){
      return 'active'
    }
    else{
      return ' '
    }
  }

  public setMainCalendarTitle() :string{
    let month = this.currentMonth;
    if(this.week[0].day > this.week[6].day && this.currentDay < 7){
      month = getPrevMonth(month, this.currentYear).getMonth();
    }
    return this.week[0].day + ' - ' + this.week[6].day + ' ' + this.months[month] + ' ' + this.currentYear 

  }

  private getWeekAppointments(value: IAppointment[]):IAppointment[]{
    let filteredArray = [] as IAppointment[];
    value.forEach((data: IAppointment) => {
      this.week.forEach((weekDay: IDay) => {
        if(weekDay.day === data.date.getDate() && weekDay.month === data.date.getMonth() && weekDay.year === data.date.getFullYear()){
          filteredArray.push(data)
        }
      })
    })
    return filteredArray;
  }

  public handleClickedDate(value: IHour, event: Event):void{  
    let element = event.target as HTMLElement

    if(element.classList.contains('hour')){
      this.showAppointmentPopup = false
    }
    else{
      this.clickedAppointments = value;
      this.showAppointmentPopup = true;
    }
    
  }

  public handlePopupClose(event: Event, element: HTMLDivElement):void{
    if(event.target === element){
      this.showAppointmentPopup = false;
    }
    
  }


  public getNextAppointment(value: IHour):void{
    let indexOfLastWeekAppointment = this.allAppointments.length;
    let indexOfNextAppointment = 0;
    let nextAppointment = {} as IHour;
    let nextAppointments = [] as IAppointment[];
    
    if(value.appointments.length === 0){
      let i = 0;
      while(i < this.allAppointments.length){
        if( (this.allAppointments[i].date.getDate() === value.day && this.allAppointments[i].date.getHours() >= value.endHour) 
        || this.allAppointments[i].date.getDate() > value.day){
          indexOfLastWeekAppointment = this.allAppointments[i].index - 1
          break;
        }
        i++;
      }
    }

    if(value.appointments.length === 0){
      indexOfNextAppointment = indexOfLastWeekAppointment + 1;
    }
    else{
      indexOfLastWeekAppointment = value.appointments[value.appointments.length-1].index;
      indexOfNextAppointment = indexOfLastWeekAppointment + 1;
    }
      
      if(indexOfNextAppointment >= this.allAppointments.length){

        alert("There aren't any future appointments")
      }
      else{

        nextAppointment = {
          day: this.allAppointments[indexOfNextAppointment].date.getDate(),
          month: this.allAppointments[indexOfNextAppointment].date.getMonth(),
          year: this.allAppointments[indexOfNextAppointment].date.getFullYear(),
          startHour: this.allAppointments[indexOfNextAppointment].date.getHours(),
          endHour: this.allAppointments[indexOfNextAppointment].date.getHours() + 1,
          weekDay: getDay(this.allAppointments[indexOfNextAppointment].date),
          name: '',
          appointments: []
        }
        
        this.allAppointments.forEach((data: IAppointment) => {

          if(data.date.getDate() === nextAppointment.day && data.date.getHours() === nextAppointment.startHour){
            
            nextAppointments.push(data)
          }
        })
        nextAppointment.appointments = [...nextAppointments]
        this.clickedAppointments = {...nextAppointment}
        this.store.dispatch(setDate({
          date:
          {
            day: nextAppointment.day,
            month: nextAppointment.month,
            year: nextAppointment.year
          }
        })
        )
      }
  }

  public getPrevAppointment(value: IHour):void{
    let indexOfLastWeekAppointment = 0;
    let indexOfPrevAppointment = 0;
    let nextAppointment = {} as IHour;
    let nextAppointments = [] as IAppointment[];
    
    if(value.appointments.length === 0){
      let i = this.allAppointments[this.allAppointments.length - 1].index;
      while(i >= 0){
        if( (this.allAppointments[i].date.getDate() === value.day && this.allAppointments[i].date.getHours() < value.startHour) 
        || this.allAppointments[i].date.getDate() < value.day){
          indexOfLastWeekAppointment = this.allAppointments[i].index + 1;
          break;
        }
        i--;
      }
    }

    if(value.appointments.length === 0){
      indexOfPrevAppointment = indexOfLastWeekAppointment - 1;
    }
    else{
      indexOfLastWeekAppointment = value.appointments[0].index;
      indexOfPrevAppointment = indexOfLastWeekAppointment - 1;
    }
      
      if(indexOfPrevAppointment < 0){

        alert("There aren't any past appointments")
      }
      else{

        nextAppointment = {
          day: this.allAppointments[indexOfPrevAppointment].date.getDate(),
          month: this.allAppointments[indexOfPrevAppointment].date.getMonth(),
          year: this.allAppointments[indexOfPrevAppointment].date.getFullYear(),
          startHour: this.allAppointments[indexOfPrevAppointment].date.getHours(),
          endHour: this.allAppointments[indexOfPrevAppointment].date.getHours() + 1,
          weekDay: getDay(this.allAppointments[indexOfPrevAppointment].date),
          name: '',
          appointments: []
        }
        this.allAppointments.forEach((data: IAppointment) => {

          if(data.date.getDate() === nextAppointment.day && data.date.getHours() === nextAppointment.startHour){
            
            nextAppointments.push(data)
          }
        })
        nextAppointment.appointments = [...nextAppointments]
        this.clickedAppointments = {...nextAppointment}
        this.store.dispatch(setDate({
          date:
          {
            day: nextAppointment.day,
            month: nextAppointment.month,
            year: nextAppointment.year
          }
        })
        )
      }
  }
}

