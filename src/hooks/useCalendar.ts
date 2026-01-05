'use client';

import { useState, useCallback } from 'react';
import { CalendarView, CalendarState } from '@/types/calendar';
import { addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from 'date-fns';

export function useCalendar(initialDate: Date = new Date(2026, 0, 1)) {
  const [state, setState] = useState<CalendarState>({
    currentDate: initialDate,
    view: CalendarView.MONTH,
    selectedDate: undefined,
    selectedEvent: undefined,
  });

  const setView = useCallback((view: CalendarView) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  const setCurrentDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, currentDate: date }));
  }, []);

  const setSelectedDate = useCallback((date: Date | undefined) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  }, []);

  const setSelectedEvent = useCallback((eventId: string | undefined) => {
    setState(prev => ({ ...prev, selectedEvent: eventId }));
  }, []);

  const goToToday = useCallback(() => {
    setState(prev => ({ ...prev, currentDate: new Date() }));
  }, []);

  const goToNext = useCallback(() => {
    setState(prev => {
      let newDate: Date;
      switch (prev.view) {
        case CalendarView.MONTH:
          newDate = addMonths(prev.currentDate, 1);
          break;
        case CalendarView.WEEK:
          newDate = addWeeks(prev.currentDate, 1);
          break;
        case CalendarView.DAY:
          newDate = addDays(prev.currentDate, 1);
          break;
        default:
          newDate = prev.currentDate;
      }
      return { ...prev, currentDate: newDate };
    });
  }, []);

  const goToPrevious = useCallback(() => {
    setState(prev => {
      let newDate: Date;
      switch (prev.view) {
        case CalendarView.MONTH:
          newDate = subMonths(prev.currentDate, 1);
          break;
        case CalendarView.WEEK:
          newDate = subWeeks(prev.currentDate, 1);
          break;
        case CalendarView.DAY:
          newDate = subDays(prev.currentDate, 1);
          break;
        default:
          newDate = prev.currentDate;
      }
      return { ...prev, currentDate: newDate };
    });
  }, []);

  return {
    state,
    setView,
    setCurrentDate,
    setSelectedDate,
    setSelectedEvent,
    goToToday,
    goToNext,
    goToPrevious,
  };
}
