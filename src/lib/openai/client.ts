import OpenAI from 'openai';
import { CalendarEvent, EventPayload, EventCategory } from '@/types/event';
import {
  AIScheduleRequest,
  AIScheduleResponse,
  AIConflictDetection,
  AISummary,
  AICategorizationResult,
} from '@/types/ai';
import { eventStore } from '@/lib/calendar/eventStore';
import { findEventConflicts } from '@/lib/calendar/utils';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Note: In production, use server-side API routes
});

// Parse natural language to event
export async function parseNaturalLanguageToEvent(
  request: AIScheduleRequest
): Promise<AIScheduleResponse> {
  try {
    const systemPrompt = `You are a calendar assistant that helps parse natural language into calendar events.
Current date and time: ${new Date().toISOString()}
User timezone: ${request.userTimezone || 'UTC'}

Given a natural language input, extract the following information:
- title: Event title
- description: Event description (if mentioned)
- startDate: Start date and time (ISO format)
- endDate: End date and time (ISO format)
- allDay: Whether it's an all-day event (boolean)
- location: Location (if mentioned)
- category: Event category (work, personal, health, meeting, appointment, birthday, holiday, other)

Respond in JSON format with these fields. If you can't determine a field, set it to null.
For dates, default to the year 2026 if not specified.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.naturalLanguageInput },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      return {
        success: false,
        message: 'Failed to parse event from natural language',
      };
    }

    const parsed = JSON.parse(responseContent);
    
    // Create event payload
    const eventPayload: EventPayload = {
      title: parsed.title || 'Untitled Event',
      description: parsed.description,
      startDate: new Date(parsed.startDate),
      endDate: new Date(parsed.endDate),
      allDay: parsed.allDay || false,
      location: parsed.location,
      category: parsed.category as EventCategory || EventCategory.OTHER,
    };

    // Check for conflicts
    const tempEvent = eventStore.createEvent(eventPayload);
    const conflicts = findEventConflicts(tempEvent, request.contextEvents || []);
    
    if (conflicts.length > 0) {
      return {
        success: true,
        event: tempEvent,
        message: `Event created, but there are ${conflicts.length} scheduling conflicts.`,
        confidence: 0.7,
      };
    }

    return {
      success: true,
      event: tempEvent,
      message: 'Event successfully created from natural language input.',
      confidence: 0.9,
    };
  } catch (error) {
    console.error('Error parsing natural language:', error);
    return {
      success: false,
      message: `Failed to parse event: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Detect scheduling conflicts with AI
export async function detectConflictsWithAI(
  event: CalendarEvent,
  existingEvents: CalendarEvent[]
): Promise<AIConflictDetection> {
  const conflicts = findEventConflicts(event, existingEvents);

  if (conflicts.length === 0) {
    return {
      hasConflict: false,
      conflicts: [],
    };
  }

  try {
    const prompt = `Analyze these scheduling conflicts and provide a suggestion:
Event: ${event.title} at ${event.startDate.toISOString()}
Conflicts with: ${conflicts.map(c => `${c.event2.title} (${c.overlapMinutes} min overlap)`).join(', ')}

Suggest the best time to reschedule or how to resolve the conflict.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const suggestion = completion.choices[0]?.message?.content || '';

    return {
      hasConflict: true,
      conflicts: conflicts.map(c => ({
        event1: c.event1,
        event2: c.event2,
        severity: c.overlapMinutes > 30 ? 'high' : c.overlapMinutes > 15 ? 'medium' : 'low',
      })),
      suggestion,
    };
  } catch (error) {
    console.error('Error detecting conflicts with AI:', error);
    return {
      hasConflict: true,
      conflicts: conflicts.map(c => ({
        event1: c.event1,
        event2: c.event2,
        severity: 'medium',
      })),
    };
  }
}

// Generate AI summary for a day/week
export async function generateAISummary(
  date: Date,
  events: CalendarEvent[]
): Promise<AISummary> {
  const categories = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<EventCategory, number>);

  const totalMinutes = events.reduce((sum, event) => {
    const duration = (event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60);
    return sum + duration;
  }, 0);

  try {
    const prompt = `Summarize this day's schedule:
Date: ${date.toDateString()}
Total events: ${events.length}
Events: ${events.map(e => `${e.title} (${e.category})`).join(', ')}

Provide a brief, helpful summary in 1-2 sentences.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });

    const summary = completion.choices[0]?.message?.content || 'No summary available';

    return {
      date,
      summary,
      totalEvents: events.length,
      busyHours: Math.round(totalMinutes / 60),
      categories,
    };
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return {
      date,
      summary: `You have ${events.length} events scheduled.`,
      totalEvents: events.length,
      busyHours: Math.round(totalMinutes / 60),
      categories,
    };
  }
}

// Auto-categorize event
export async function autoCategorizeEvent(
  title: string,
  description?: string
): Promise<AICategorizationResult> {
  try {
    const prompt = `Categorize this event into one of these categories: work, personal, health, meeting, appointment, birthday, holiday, other.
    
Event: ${title}
${description ? `Description: ${description}` : ''}

Respond with just the category name.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0.3,
    });

    const category = completion.choices[0]?.message?.content?.toLowerCase().trim() as EventCategory;

    return {
      category: category || EventCategory.OTHER,
      confidence: 0.8,
      reasoning: 'AI-based categorization',
    };
  } catch (error) {
    console.error('Error auto-categorizing event:', error);
    return {
      category: EventCategory.OTHER,
      confidence: 0.0,
    };
  }
}

// Suggest optimal meeting times
export async function suggestMeetingTimes(
  duration: number,
  participants: number,
  existingEvents: CalendarEvent[]
): Promise<Date[]> {
  // Simple algorithm: find gaps in schedule
  const suggestions: Date[] = [];
  const today = new Date();
  const workStart = 9; // 9 AM
  const workEnd = 17; // 5 PM

  for (let day = 0; day < 7; day++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() + day);

    // Skip weekends
    if (checkDate.getDay() === 0 || checkDate.getDay() === 6) continue;

    for (let hour = workStart; hour < workEnd; hour++) {
      const slotStart = new Date(checkDate);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      // Check if slot is free
      const hasConflict = existingEvents.some(event => {
        return (
          slotStart < event.endDate && slotEnd > event.startDate
        );
      });

      if (!hasConflict) {
        suggestions.push(slotStart);
        if (suggestions.length >= 5) break;
      }
    }
    if (suggestions.length >= 5) break;
  }

  return suggestions;
}
