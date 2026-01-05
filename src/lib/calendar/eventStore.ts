import { CalendarEvent, EventPayload, EventFilter, EventCategory } from '@/types/event';
import { v4 as uuidv4 } from 'uuid';

// In-memory event store (can be replaced with a database)
class EventStore {
  private events: Map<string, CalendarEvent> = new Map();
  private listeners: Set<(events: CalendarEvent[]) => void> = new Set();

  // Get all events
  getAllEvents(): CalendarEvent[] {
    return Array.from(this.events.values());
  }

  // Get event by ID
  getEvent(id: string): CalendarEvent | undefined {
    return this.events.get(id);
  }

  // Get events for a date range
  getEventsByDateRange(startDate: Date, endDate: Date): CalendarEvent[] {
    return this.getAllEvents().filter(event => {
      return (
        (event.startDate >= startDate && event.startDate <= endDate) ||
        (event.endDate >= startDate && event.endDate <= endDate) ||
        (event.startDate <= startDate && event.endDate >= endDate)
      );
    });
  }

  // Get events for a specific date
  getEventsByDate(date: Date): CalendarEvent[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.getEventsByDateRange(startOfDay, endOfDay);
  }

  // Filter events
  filterEvents(filter: EventFilter): CalendarEvent[] {
    let events = this.getAllEvents();

    if (filter.categories && filter.categories.length > 0) {
      events = events.filter(event => filter.categories!.includes(event.category));
    }

    if (filter.startDate && filter.endDate) {
      events = this.getEventsByDateRange(filter.startDate, filter.endDate);
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query)
      );
    }

    return events;
  }

  // Create event
  createEvent(payload: EventPayload): CalendarEvent {
    const now = new Date();
    const event: CalendarEvent = {
      id: uuidv4(),
      title: payload.title,
      description: payload.description,
      startDate: typeof payload.startDate === 'string' ? new Date(payload.startDate) : payload.startDate,
      endDate: typeof payload.endDate === 'string' ? new Date(payload.endDate) : payload.endDate,
      allDay: payload.allDay || false,
      location: payload.location,
      category: payload.category || EventCategory.OTHER,
      color: payload.color || this.getCategoryColor(payload.category || EventCategory.OTHER),
      recurring: payload.recurring,
      reminders: payload.reminders || [],
      createdAt: now,
      updatedAt: now,
    };

    this.events.set(event.id, event);
    this.notifyListeners();
    this.saveToLocalStorage();
    return event;
  }

  // Update event
  updateEvent(id: string, payload: Partial<EventPayload>): CalendarEvent | undefined {
    const event = this.events.get(id);
    if (!event) return undefined;

    const updatedEvent: CalendarEvent = {
      ...event,
      ...payload,
      startDate: payload.startDate 
        ? (typeof payload.startDate === 'string' ? new Date(payload.startDate) : payload.startDate)
        : event.startDate,
      endDate: payload.endDate
        ? (typeof payload.endDate === 'string' ? new Date(payload.endDate) : payload.endDate)
        : event.endDate,
      updatedAt: new Date(),
    };

    this.events.set(id, updatedEvent);
    this.notifyListeners();
    this.saveToLocalStorage();
    return updatedEvent;
  }

  // Delete event
  deleteEvent(id: string): boolean {
    const deleted = this.events.delete(id);
    if (deleted) {
      this.notifyListeners();
      this.saveToLocalStorage();
    }
    return deleted;
  }

  // Subscribe to changes
  subscribe(listener: (events: CalendarEvent[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify listeners
  private notifyListeners(): void {
    const events = this.getAllEvents();
    this.listeners.forEach(listener => listener(events));
  }

  // Get category color
  private getCategoryColor(category: EventCategory): string {
    const colors: Record<EventCategory, string> = {
      [EventCategory.WORK]: '#3b82f6',
      [EventCategory.PERSONAL]: '#10b981',
      [EventCategory.HEALTH]: '#f59e0b',
      [EventCategory.MEETING]: '#8b5cf6',
      [EventCategory.APPOINTMENT]: '#ec4899',
      [EventCategory.BIRTHDAY]: '#f97316',
      [EventCategory.HOLIDAY]: '#ef4444',
      [EventCategory.OTHER]: '#6b7280',
    };
    return colors[category];
  }

  // Save to localStorage
  private saveToLocalStorage(): void {
    if (typeof window !== 'undefined') {
      const eventsArray = this.getAllEvents();
      localStorage.setItem('calendar-events', JSON.stringify(eventsArray));
    }
  }

  // Load from localStorage
  loadFromLocalStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('calendar-events');
      if (stored) {
        try {
          const eventsArray: CalendarEvent[] = JSON.parse(stored);
          eventsArray.forEach(event => {
            // Convert date strings back to Date objects
            event.startDate = new Date(event.startDate);
            event.endDate = new Date(event.endDate);
            event.createdAt = new Date(event.createdAt);
            event.updatedAt = new Date(event.updatedAt);
            this.events.set(event.id, event);
          });
          this.notifyListeners();
        } catch (error) {
          console.error('Failed to load events from localStorage:', error);
        }
      }
    }
  }

  // Clear all events
  clear(): void {
    this.events.clear();
    this.notifyListeners();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('calendar-events');
    }
  }
}

// Export singleton instance
export const eventStore = new EventStore();
