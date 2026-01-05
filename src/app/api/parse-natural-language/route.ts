import { NextRequest, NextResponse } from 'next/server';
import { eventStore } from '@/lib/calendar/eventStore';
import { EventCategory } from '@/types/event';

// Server-side natural language parsing without OpenAI client in browser
export async function POST(request: NextRequest) {
  const { input, timezone = 'UTC' } = await request.json();

  if (!input) {
    return NextResponse.json({ error: 'Input is required' }, { status: 400 });
  }

  try {
    // Use OpenAI API server-side
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a calendar assistant that helps parse natural language into calendar events.
Current date and time: ${new Date().toISOString()}
User timezone: ${timezone}

Given a natural language input, extract the following information:
- title: Event title
- description: Event description (if mentioned)
- startDate: Start date and time (ISO format)
- endDate: End date and time (ISO format)
- allDay: Whether it's an all-day event (boolean)
- location: Location (if mentioned)
- category: Event category (work, personal, health, meeting, appointment, birthday, holiday, other)

Respond in JSON format with these fields. If you can't determine a field, set it to null.
For dates, default to the year 2026 if not specified.`,
          },
          {
            role: 'user',
            content: input,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0]?.message?.content || '{}');

    const event = eventStore.createEvent({
      title: parsed.title || 'Untitled Event',
      description: parsed.description,
      startDate: new Date(parsed.startDate),
      endDate: new Date(parsed.endDate),
      allDay: parsed.allDay || false,
      location: parsed.location,
      category: (parsed.category as EventCategory) || EventCategory.OTHER,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error parsing natural language:', error);
    return NextResponse.json(
      { error: 'Failed to parse natural language input' },
      { status: 500 }
    );
  }
}
