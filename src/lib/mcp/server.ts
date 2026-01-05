import { MCPContext, MCPAction, MCPResponse, UserPreferences } from '@/types/mcp';
import { CalendarEvent } from '@/types/event';
import { eventStore } from '@/lib/calendar/eventStore';

// MCP Server for calendar context management
class MCPServer {
  private context: MCPContext;
  private listeners: Set<(context: MCPContext) => void> = new Set();

  constructor() {
    this.context = {
      events: [],
      currentDate: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userPreferences: this.getDefaultPreferences(),
    };
  }

  // Get default user preferences
  private getDefaultPreferences(): UserPreferences {
    return {
      workingHours: { start: 9, end: 17 },
      workingDays: [1, 2, 3, 4, 5], // Monday to Friday
      defaultEventDuration: 60,
      defaultReminders: [15, 60], // 15 min and 1 hour before
      theme: 'auto',
    };
  }

  // Get current context
  getContext(): MCPContext {
    return { ...this.context };
  }

  // Update context
  updateContext(updates: Partial<MCPContext>): void {
    this.context = {
      ...this.context,
      ...updates,
    };
    this.notifyListeners();
    this.persistContext();
  }

  // Handle action
  async handleAction(action: MCPAction): Promise<MCPResponse> {
    try {
      switch (action.type) {
        case 'create':
          return await this.handleCreate(action);
        case 'update':
          return await this.handleUpdate(action);
        case 'delete':
          return await this.handleDelete(action);
        case 'query':
          return await this.handleQuery(action);
        default:
          return {
            success: false,
            error: `Unknown action type: ${action.type}`,
          };
      }
    } catch (error) {
      console.error('Error handling MCP action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Handle create action
  private async handleCreate(action: MCPAction): Promise<MCPResponse> {
    const event = eventStore.createEvent(action.payload);
    this.context.events = eventStore.getAllEvents();
    this.notifyListeners();
    this.persistContext();

    return {
      success: true,
      data: event,
      context: this.getContext(),
    };
  }

  // Handle update action
  private async handleUpdate(action: MCPAction): Promise<MCPResponse> {
    const { id, ...updates } = action.payload;
    const event = eventStore.updateEvent(id, updates);

    if (!event) {
      return {
        success: false,
        error: `Event not found: ${id}`,
      };
    }

    this.context.events = eventStore.getAllEvents();
    this.notifyListeners();
    this.persistContext();

    return {
      success: true,
      data: event,
      context: this.getContext(),
    };
  }

  // Handle delete action
  private async handleDelete(action: MCPAction): Promise<MCPResponse> {
    const { id } = action.payload;
    const deleted = eventStore.deleteEvent(id);

    if (!deleted) {
      return {
        success: false,
        error: `Event not found: ${id}`,
      };
    }

    this.context.events = eventStore.getAllEvents();
    this.notifyListeners();
    this.persistContext();

    return {
      success: true,
      data: { id },
      context: this.getContext(),
    };
  }

  // Handle query action
  private async handleQuery(action: MCPAction): Promise<MCPResponse> {
    const { filter } = action.payload;
    const events = filter
      ? eventStore.filterEvents(filter)
      : eventStore.getAllEvents();

    return {
      success: true,
      data: events,
      context: this.getContext(),
    };
  }

  // Subscribe to context changes
  subscribe(listener: (context: MCPContext) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify listeners of context changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getContext()));
  }

  // Persist context to storage
  private persistContext(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mcp-context', JSON.stringify({
          currentDate: this.context.currentDate,
          timezone: this.context.timezone,
          userPreferences: this.context.userPreferences,
        }));
      } catch (error) {
        console.error('Failed to persist MCP context:', error);
      }
    }
  }

  // Load context from storage
  loadContext(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mcp-context');
        if (stored) {
          const parsed = JSON.parse(stored);
          this.context = {
            ...this.context,
            currentDate: new Date(parsed.currentDate),
            timezone: parsed.timezone,
            userPreferences: parsed.userPreferences,
          };
          this.notifyListeners();
        }
      } catch (error) {
        console.error('Failed to load MCP context:', error);
      }
    }

    // Load events from event store
    this.context.events = eventStore.getAllEvents();
  }

  // Sync with event store
  syncWithEventStore(): void {
    this.context.events = eventStore.getAllEvents();
    this.notifyListeners();
  }

  // Update user preferences
  updatePreferences(preferences: Partial<UserPreferences>): void {
    this.context.userPreferences = {
      ...this.context.userPreferences!,
      ...preferences,
    };
    this.notifyListeners();
    this.persistContext();
  }

  // Get event context for AI
  getEventContext(date?: Date): string {
    const targetDate = date || this.context.currentDate;
    const events = this.context.events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === targetDate.getFullYear() &&
        eventDate.getMonth() === targetDate.getMonth() &&
        eventDate.getDate() === targetDate.getDate()
      );
    });

    return `Current date: ${targetDate.toISOString()}
Timezone: ${this.context.timezone}
Events today: ${events.length}
${events.map(e => `- ${e.title} at ${e.startDate.toTimeString()}`).join('\n')}
Working hours: ${this.context.userPreferences?.workingHours.start}:00 - ${this.context.userPreferences?.workingHours.end}:00`;
  }
}

// Export singleton instance
export const mcpServer = new MCPServer();

// Initialize MCP integration
export function initializeMCP(): void {
  mcpServer.loadContext();
  
  // Subscribe to event store changes
  eventStore.subscribe(() => {
    mcpServer.syncWithEventStore();
  });

  // Sync initial state
  mcpServer.syncWithEventStore();
}
