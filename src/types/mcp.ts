import { CalendarEvent } from './event';

// MCP (Model Context Protocol) types
export interface MCPContext {
  events: CalendarEvent[];
  currentDate: Date;
  timezone: string;
  userPreferences?: UserPreferences;
}

export interface UserPreferences {
  workingHours: {
    start: number; // 0-23
    end: number; // 0-23
  };
  workingDays: number[]; // 0-6, Sunday = 0
  defaultEventDuration: number; // minutes
  defaultReminders: number[]; // minutes before event
  theme: 'light' | 'dark' | 'auto';
}

export interface MCPAction {
  type: 'create' | 'update' | 'delete' | 'query';
  payload: any;
  timestamp: Date;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  context?: MCPContext;
}

// MCP server configuration
export interface MCPServerConfig {
  url: string;
  apiKey?: string;
  timeout: number;
}
