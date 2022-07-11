import { getDay, getDaysInMonth } from "date-fns";
import { IDay } from "./iday";

export function getPrevMonth(month: number, year: number):Date{
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = month === 11 ? year - 1 : year
    return new Date(prevYear, prevMonth)
}

export function getNextMonth(month: number, year: number):Date{
    let nextMonth = month === 11 ? 0 : month + 1;
    let nextYear = month === 0 ? year + 1 : year;
    return new Date(nextYear, nextMonth)
}

export function setWeek(date: IDay):IDay[]{
    let thisWeek = [];

    let day = date.day;
    let month = date.month;
    let year = date.year;
        
    let currentWeekDay = getDay(new Date(year, month, day));
    let currentMonthNumberOfDays = getDaysInMonth(new Date(year, month));
    let prevMonthNumberOfDays = getDaysInMonth(getPrevMonth(month, year));
    
    let weekDay = day - currentWeekDay;

    if(weekDay <= 0){

        weekDay = prevMonthNumberOfDays + weekDay
        currentMonthNumberOfDays = prevMonthNumberOfDays
        month = getPrevMonth(month, year).getMonth();
        year = getPrevMonth(month, year).getFullYear();
    }
    for(let i = 0; i < 7; i++){
    
        if(weekDay > currentMonthNumberOfDays){
    
            weekDay = 1;
            month = getNextMonth(month, year).getMonth();
            year = getNextMonth(month, year).getFullYear();
        }
        thisWeek.push({day: weekDay++, month: month, year: year})
    }
    return thisWeek;
}

export const months: string[] = [
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

  export const weekDays: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]