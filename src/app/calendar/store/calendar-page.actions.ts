import { createAction, props } from "@ngrx/store";
import { IDay } from "../iday";

export const setDate = createAction(
    '[Calendar Page] Change Date',
    props<{ date: IDay }>()
)

export const setWeek = createAction(
    '[Calendar Page] Set Week',
    props<{ date: IDay }>()  
)