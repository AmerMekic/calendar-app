import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IAppointment } from '../iappointment';
import { IHotel } from '../ihotel';
import { IHour } from '../ihour';
import { months, weekDays } from '../calendar-functions'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faClock, faUser } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-view-modal',
  templateUrl: './view-modal.component.html',
  styleUrls: ['./view-modal.component.scss']
})
export class ViewModalComponent implements OnInit, OnChanges {


  leftArrow = faAngleLeft;
  rightArrow = faAngleRight;
  clockIcon = faClock;
  calendarIcon = faCalendar;
  userIcon = faUser;

  @Input() appointmentsOnCurrentDay!: IHour;
  hotels: Set<string> = new Set();
  appointmentsByHotel: IHotel[] = [];
  agent: string = 'Leroy Alvarado';
  agentType: string = 'Agent';

  @Output() nextAppointmentEmitter: EventEmitter<IHour> = new EventEmitter;
  @Output() prevAppointmentEmmiter: EventEmitter<IHour> = new EventEmitter;
  constructor() { }

  ngOnInit(): void {
  }
  
  ngOnChanges(): void {
    if(this.appointmentsOnCurrentDay)
      this.getHotels(this.appointmentsOnCurrentDay.appointments)
    
  }

  private getHotels(appointmentsOnCurrentDay: IAppointment[]):void{
    this.appointmentsByHotel = []
    let tempAppointments = appointmentsOnCurrentDay;
    this.hotels = new Set(tempAppointments.map((item => item.propertyName)))
    this.hotels.forEach(hotel => {

      let tempHotelAppointment = {name: hotel, address: '', appointments: [] as IAppointment[]};
      tempAppointments.forEach((appointment: IAppointment) => {

        if(appointment.propertyName === hotel){
          if(tempHotelAppointment.address === ''){
            tempHotelAppointment.address = appointment.propertyAddress;
          }
          tempHotelAppointment.appointments.push(appointment)
          tempAppointments = tempAppointments.filter(item => item.id !== appointment.id)
        }
      })
      this.appointmentsByHotel.push(tempHotelAppointment)
    })
  }

  public getDate():string{
    return `${weekDays[this.appointmentsOnCurrentDay.weekDay]}, ${this.appointmentsOnCurrentDay.day} 
            ${months[this.appointmentsOnCurrentDay.month]} ${this.appointmentsOnCurrentDay.year}`
  }

  public getTime(value: IAppointment):string{
    let tempMinute = value.date.getMinutes() === 0 ? '00' : value.date.getMinutes()
    return `${value.date.getHours()}:${tempMinute}`
  }

  public getInvitees(value: IAppointment):string{
    return `${value.atendeeCount} | ${value.maxInviteeCount}`
  }

  public getDateOfAppointment(value: IAppointment):string{
    return `${this.appointmentsOnCurrentDay.day} ${months[this.appointmentsOnCurrentDay.month]} 
            ${this.appointmentsOnCurrentDay.year}`
  }
  
  public nextAppointment():void{
    let appointmentsOnCurrentDayLength = this.appointmentsOnCurrentDay.appointments.length - 1;
    this.nextAppointmentEmitter.emit(this.appointmentsOnCurrentDay);
  }

  public prevAppointment():void{
    this.prevAppointmentEmmiter.emit(this.appointmentsOnCurrentDay);
  }
}
