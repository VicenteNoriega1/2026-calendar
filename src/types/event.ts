// Core event type definition
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location?: string;
  category: EventCategory;
  color?: string;
  recurring?: RecurringPattern;
  reminders?: Reminder[];
  createdAt: Date;
  updatedAt: Date;
}

// Event categories
export enum EventCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  HEALTH = 'health',
  MEETING = 'meeting',
  APPOINTMENT = 'appointment',
  BIRTHDAY = 'birthday',
  HOLIDAY = 'holiday',
  OTHER = 'other',
}

// Recurring pattern types
export enum RecurringType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export interface RecurringPattern {
  type: RecurringType;
  interval: number; // e.g., every 2 weeks
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  dayOfMonth?: number;
}

// Reminder configuration
export interface Reminder {
  id: string;
  minutes: number; // Minutes before event
  type: 'notification' | 'email';
}

// Event creation/update payload
export interface EventPayload {
  title: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  allDay?: boolean;
  location?: string;
  category?: EventCategory;
  color?: string;
  recurring?: RecurringPattern;
  reminders?: Reminder[];
}

// Event filter options
export interface EventFilter {
  categories?: EventCategory[];
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}

// Event conflict detection
export interface EventConflict {
  event1: CalendarEvent;
  event2: CalendarEvent;
  overlapMinutes: number;
}
