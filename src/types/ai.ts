import { CalendarEvent, EventCategory } from './event';

// AI-powered features
export interface AIScheduleRequest {
  naturalLanguageInput: string;
  contextEvents?: CalendarEvent[];
  userTimezone?: string;
}

export interface AIScheduleResponse {
  success: boolean;
  event?: CalendarEvent;
  suggestions?: CalendarEvent[];
  message: string;
  confidence?: number;
}

export interface AIConflictDetection {
  hasConflict: boolean;
  conflicts: Array<{
    event1: CalendarEvent;
    event2: CalendarEvent;
    severity: 'low' | 'medium' | 'high';
  }>;
  suggestion?: string;
}

export interface AISummary {
  date: Date;
  summary: string;
  totalEvents: number;
  busyHours: number;
  categories: Record<EventCategory, number>;
}

export interface AICategorizationResult {
  category: EventCategory;
  confidence: number;
  reasoning?: string;
}

// OpenAI function calling types
export interface CalendarFunction {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}
