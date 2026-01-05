'use client';

import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { generateTimeSlots, getEventsForDay, sortEventsByTime } from '@/lib/calendar/utils';
import { CalendarEvent } from '@/types/event';
import { cn } from '@/lib/utils/helpers';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
}

export default function WeekView({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = generateTimeSlots(60); // 1-hour intervals

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Week days header */}
      <div className="grid grid-cols-8 border-b bg-gray-50">
        <div className="p-2 text-sm font-semibold text-gray-700 border-r">
          Time
        </div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              'p-2 text-center text-sm font-semibold border-r',
              format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') &&
                'bg-blue-50 text-blue-700'
            )}
          >
            <div>{format(day, 'EEE')}</div>
            <div className="text-lg">{format(day, 'd')}</div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="overflow-auto max-h-[600px]">
        <div className="grid grid-cols-8">
          {timeSlots.map((slot) => (
            <React.Fragment key={`${slot.hour}-${slot.minute}`}>
              <div className="p-2 text-xs text-gray-500 border-r border-b text-right">
                {slot.label}
              </div>
              {weekDays.map((day) => {
                const dayEvents = getEventsForDay(day, events);
                const slotEvents = dayEvents.filter(
                  (event) => event.startDate.getHours() === slot.hour
                );

                return (
                  <div
                    key={`${day.toISOString()}-${slot.hour}`}
                    className="p-1 border-r border-b hover:bg-gray-50 cursor-pointer min-h-[60px]"
                    onClick={() => onTimeSlotClick?.(day, slot.hour)}
                  >
                    {slotEvents.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-2 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: event.color || '#3b82f6',
                          color: 'white',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                      >
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="opacity-90">
                          {format(event.startDate, 'h:mm a')} -{' '}
                          {format(event.endDate, 'h:mm a')}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
