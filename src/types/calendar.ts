// Calendar view types
export enum CalendarView {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
}

// Calendar state
export interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  selectedDate?: Date;
  selectedEvent?: string; // event ID
}

// Calendar day cell
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: string[]; // event IDs
}

// Week structure
export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

// Month structure
export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
}

// Time slot for day/week views
export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

// Drag and drop types
export interface DraggedEvent {
  eventId: string;
  originalDate: Date;
}

export interface DropTarget {
  date: Date;
  timeSlot?: TimeSlot;
}
