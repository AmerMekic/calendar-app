import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { CalendarPageComponent } from './calendar/calendar-page/calendar-page.component';
import { SideCalendarComponent } from './calendar/side-calendar/side-calendar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainCalendarComponent } from './calendar/main-calendar/main-calendar.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { dateReducer } from './calendar/store/calendar-page.reducers';
import { CalendarEffects } from './calendar/store/calendar.effect';
import { ViewModalComponent } from './calendar/view-modal/view-modal.component';
import { appointmentReducer } from './calendar/store/appointment.reducers';
import { AppointmentEffects } from './calendar/store/appointment.effect';

@NgModule({
  declarations: [
    AppComponent,
    CalendarPageComponent,
    SideCalendarComponent,
    MainCalendarComponent,
    ViewModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ date: dateReducer, appointment: appointmentReducer }),
    FontAwesomeModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([CalendarEffects, AppointmentEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
