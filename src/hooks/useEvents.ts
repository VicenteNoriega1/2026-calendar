'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent, EventPayload, EventFilter } from '@/types/event';
import { eventStore } from '@/lib/calendar/eventStore';

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load events from local storage on mount
    eventStore.loadFromLocalStorage();
    setEvents(eventStore.getAllEvents());
    setLoading(false);

    // Subscribe to changes
    const unsubscribe = eventStore.subscribe((updatedEvents) => {
      setEvents(updatedEvents);
    });

    return unsubscribe;
  }, []);

  const createEvent = (payload: EventPayload): CalendarEvent => {
    return eventStore.createEvent(payload);
  };

  const updateEvent = (id: string, payload: Partial<EventPayload>): CalendarEvent | undefined => {
    return eventStore.updateEvent(id, payload);
  };

  const deleteEvent = (id: string): boolean => {
    return eventStore.deleteEvent(id);
  };

  const getEvent = (id: string): CalendarEvent | undefined => {
    return eventStore.getEvent(id);
  };

  const getEventsByDate = (date: Date): CalendarEvent[] => {
    return eventStore.getEventsByDate(date);
  };

  const getEventsByDateRange = (startDate: Date, endDate: Date): CalendarEvent[] => {
    return eventStore.getEventsByDateRange(startDate, endDate);
  };

  const filterEvents = (filter: EventFilter): CalendarEvent[] => {
    return eventStore.filterEvents(filter);
  };

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    getEventsByDate,
    getEventsByDateRange,
    filterEvents,
  };
}
