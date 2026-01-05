import { NextRequest, NextResponse } from 'next/server';
import { eventStore } from '@/lib/calendar/eventStore';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const category = searchParams.get('category');

  let events = eventStore.getAllEvents();

  if (startDate && endDate) {
    events = eventStore.getEventsByDateRange(new Date(startDate), new Date(endDate));
  }

  if (category) {
    events = events.filter(e => e.category === category);
  }

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const event = eventStore.createEvent(body);
  return NextResponse.json(event);
}
