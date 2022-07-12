import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { IAppointment } from './iappointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private url = 'assets/data.json';
  constructor(private http: HttpClient) { }

  public getAppointments():Observable<IAppointment[]>{
    return this.http.get<any>(this.url).pipe(
      map((data) => {
        let appointment = [] as IAppointment[]
        data.data.appointments.nodes.forEach((node: any) => {
          let address = `${node.property.address.street} ${node.property.address.houseNumber}, ${node.property.address.zipCode} ${node.property.address.city}, ${node.property.address.country}`
          appointment.push({
            index: 0,
            id: node.id,
            date: new Date(node.date),
            atendeeCount: node.attendeeCount,
            maxInviteeCount: node.maxInviteeCount,
            propertyName: node.property.name,
            propertyAddress: address,
          })
        })
        return appointment
      })
    )
  }
}
