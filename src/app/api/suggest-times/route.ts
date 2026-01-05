import { NextRequest, NextResponse } from 'next/server';
import { eventStore } from '@/lib/calendar/eventStore';

export async function POST(request: NextRequest) {
  const { duration = 60, participants = 2 } = await request.json();

  const suggestions: Date[] = [];
  const existingEvents = eventStore.getAllEvents();
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
        return slotStart < event.endDate && slotEnd > event.startDate;
      });

      if (!hasConflict) {
        suggestions.push(slotStart);
        if (suggestions.length >= 5) break;
      }
    }
    if (suggestions.length >= 5) break;
  }

  return NextResponse.json({ suggestions });
}
