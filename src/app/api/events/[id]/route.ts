import { NextRequest, NextResponse } from 'next/server';
import { eventStore } from '@/lib/calendar/eventStore';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const event = eventStore.updateEvent(params.id, body);
  
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  
  return NextResponse.json(event);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = eventStore.deleteEvent(params.id);
  
  if (!deleted) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  
  return NextResponse.json({ success: true });
}
