import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarPageComponent } from './calendar/calendar-page/calendar-page.component';

const routes: Routes = [{ path: '', component: CalendarPageComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
