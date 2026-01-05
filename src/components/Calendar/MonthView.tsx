'use client';

import React from 'react';
import { format } from 'date-fns';
import { generateCalendarMonth, getEventsForDay, sortEventsByTime } from '@/lib/calendar/utils';
import { CalendarEvent } from '@/types/event';
import { cn } from '@/lib/utils/helpers';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export default function MonthView({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: MonthViewProps) {
  const monthData = generateCalendarMonth(currentDate);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Days of week header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {monthData.weeks.map((week) =>
          week.days.map((day, index) => {
            const dayEvents = getEventsForDay(day.date, events);
            const sortedEvents = sortEventsByTime(dayEvents);
            const displayEvents = sortedEvents.slice(0, 3);
            const moreCount = sortedEvents.length - displayEvents.length;

            return (
              <div
                key={`${week.weekNumber}-${index}`}
                className={cn(
                  'min-h-[120px] p-2 border-b border-r hover:bg-gray-50 transition-colors cursor-pointer',
                  !day.isCurrentMonth && 'bg-gray-50 text-gray-400',
                  day.isToday && 'bg-blue-50',
                  day.isWeekend && 'bg-gray-25'
                )}
                onClick={() => onDateClick?.(day.date)}
              >
                <div
                  className={cn(
                    'text-sm font-medium mb-1',
                    day.isToday && 'text-blue-600 font-bold'
                  )}
                >
                  {format(day.date, 'd')}
                </div>
                <div className="space-y-1">
                  {displayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: event.color || '#3b82f6',
                        color: 'white',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      title={event.title}
                    >
                      {event.allDay ? event.title : `${format(event.startDate, 'h:mm a')} ${event.title}`}
                    </div>
                  ))}
                  {moreCount > 0 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{moreCount} more
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
