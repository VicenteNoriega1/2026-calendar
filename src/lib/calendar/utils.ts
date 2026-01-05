import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isWeekend as isWeekendDate,
  format,
  addDays,
  addWeeks,
  addMonths,
  isSameDay,
  differenceInMinutes,
  parseISO,
} from 'date-fns';
import {
  CalendarDay,
  CalendarWeek,
  CalendarMonth,
  TimeSlot,
} from '@/types/calendar';
import { CalendarEvent, EventConflict, RecurringType, RecurringPattern } from '@/types/event';

// Generate calendar month structure
export function generateCalendarMonth(date: Date): CalendarMonth {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weeks: CalendarWeek[] = [];
  
  let currentWeek: CalendarDay[] = [];
  let weekNumber = 1;

  days.forEach((day, index) => {
    const calendarDay: CalendarDay = {
      date: day,
      isCurrentMonth: isSameMonth(day, date),
      isToday: isToday(day),
      isWeekend: isWeekendDate(day),
      events: [], // Will be populated separately
    };

    currentWeek.push(calendarDay);

    if ((index + 1) % 7 === 0) {
      weeks.push({ weekNumber: weekNumber++, days: currentWeek });
      currentWeek = [];
    }
  });

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    weeks,
  };
}

// Generate time slots for day/week view
export function generateTimeSlots(interval: number = 30): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      slots.push({
        hour,
        minute,
        label: formatTimeSlot(hour, minute),
      });
    }
  }
  return slots;
}

// Format time slot
export function formatTimeSlot(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

// Check if two events conflict
export function detectEventConflict(event1: CalendarEvent, event2: CalendarEvent): EventConflict | null {
  // Skip all-day events
  if (event1.allDay || event2.allDay) return null;

  const start1 = event1.startDate.getTime();
  const end1 = event1.endDate.getTime();
  const start2 = event2.startDate.getTime();
  const end2 = event2.endDate.getTime();

  // Check for overlap
  if (start1 < end2 && end1 > start2) {
    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);
    const overlapMinutes = (overlapEnd - overlapStart) / (1000 * 60);

    return {
      event1,
      event2,
      overlapMinutes,
    };
  }

  return null;
}

// Find all conflicts for an event
export function findEventConflicts(event: CalendarEvent, allEvents: CalendarEvent[]): EventConflict[] {
  const conflicts: EventConflict[] = [];
  
  allEvents.forEach(otherEvent => {
    if (event.id !== otherEvent.id) {
      const conflict = detectEventConflict(event, otherEvent);
      if (conflict) {
        conflicts.push(conflict);
      }
    }
  });

  return conflicts;
}

// Generate recurring event instances
export function generateRecurringInstances(
  baseEvent: CalendarEvent,
  startDate: Date,
  endDate: Date
): CalendarEvent[] {
  if (!baseEvent.recurring) return [baseEvent];

  const instances: CalendarEvent[] = [];
  const pattern = baseEvent.recurring;
  let currentDate = new Date(baseEvent.startDate);
  const duration = differenceInMinutes(baseEvent.endDate, baseEvent.startDate);

  while (currentDate <= endDate) {
    if (currentDate >= startDate) {
      // Check if this instance should be included
      let shouldInclude = true;

      if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
        shouldInclude = pattern.daysOfWeek.includes(currentDate.getDay());
      }

      if (pattern.endDate && currentDate > pattern.endDate) {
        break;
      }

      if (shouldInclude) {
        const instanceEnd = new Date(currentDate);
        instanceEnd.setMinutes(instanceEnd.getMinutes() + duration);

        instances.push({
          ...baseEvent,
          id: `${baseEvent.id}-${currentDate.getTime()}`,
          startDate: new Date(currentDate),
          endDate: instanceEnd,
        });
      }
    }

    // Move to next occurrence
    switch (pattern.type) {
      case RecurringType.DAILY:
        currentDate = addDays(currentDate, pattern.interval);
        break;
      case RecurringType.WEEKLY:
        currentDate = addWeeks(currentDate, pattern.interval);
        break;
      case RecurringType.MONTHLY:
        currentDate = addMonths(currentDate, pattern.interval);
        break;
      default:
        return instances;
    }
  }

  return instances;
}

// Format date for display
export function formatDate(date: Date, formatStr: string = 'PPP'): string {
  return format(date, formatStr);
}

// Parse date string
export function parseDate(dateStr: string): Date {
  return parseISO(dateStr);
}

// Check if date is in range
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

// Get week number
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Get events for a specific day
export function getEventsForDay(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => {
    if (event.allDay) {
      return isSameDay(event.startDate, date);
    }
    return (
      isSameDay(event.startDate, date) ||
      isSameDay(event.endDate, date) ||
      (event.startDate < date && event.endDate > date)
    );
  });
}

// Sort events by start time
export function sortEventsByTime(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}
