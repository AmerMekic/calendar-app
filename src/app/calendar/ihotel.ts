import { IAppointment } from "./iappointment";

export interface IHotel{
    name: string,
    address: string,
    appointments: IAppointment[]
}