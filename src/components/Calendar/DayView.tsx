'use client';

import React from 'react';
import { format } from 'date-fns';
import { generateTimeSlots, getEventsForDay, sortEventsByTime } from '@/lib/calendar/utils';
import { CalendarEvent } from '@/types/event';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (hour: number) => void;
}

export default function DayView({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: DayViewProps) {
  const timeSlots = generateTimeSlots(30); // 30-minute intervals
  const dayEvents = getEventsForDay(currentDate, events);
  const sortedEvents = sortEventsByTime(dayEvents);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Day header */}
      <div className="bg-gray-50 border-b p-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
        {sortedEvents.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''} scheduled
          </p>
        )}
      </div>

      {/* Time grid */}
      <div className="overflow-auto max-h-[600px]">
        <div className="divide-y">
          {timeSlots.map((slot) => {
            const slotEvents = sortedEvents.filter(
              (event) =>
                event.startDate.getHours() === slot.hour &&
                event.startDate.getMinutes() === slot.minute
            );

            return (
              <div
                key={`${slot.hour}-${slot.minute}`}
                className="grid grid-cols-12 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2 p-3 text-sm text-gray-500 border-r text-right">
                  {slot.label}
                </div>
                <div
                  className="col-span-10 p-3 cursor-pointer min-h-[60px]"
                  onClick={() => onTimeSlotClick?.(slot.hour)}
                >
                  {slotEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg mb-2 cursor-pointer hover:shadow-md transition-shadow"
                      style={{
                        backgroundColor: event.color || '#3b82f6',
                        color: 'white',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm opacity-90 mt-1">{event.description}</p>
                          )}
                          {event.location && (
                            <p className="text-sm opacity-80 mt-1">
                              📍 {event.location}
                            </p>
                          )}
                        </div>
                        <div className="text-sm opacity-90">
                          {format(event.startDate, 'h:mm a')} -{' '}
                          {format(event.endDate, 'h:mm a')}
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2 text-xs">
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                          {event.category}
                        </span>
                        {event.recurring && (
                          <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                            🔁 Recurring
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All-day events section */}
      {sortedEvents.filter((e) => e.allDay).length > 0 && (
        <div className="border-t p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">All-day Events</h3>
          <div className="space-y-2">
            {sortedEvents
              .filter((e) => e.allDay)
              .map((event) => (
                <div
                  key={event.id}
                  className="p-2 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: event.color || '#3b82f6',
                    color: 'white',
                  }}
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="font-semibold">{event.title}</div>
                  {event.description && (
                    <div className="text-sm opacity-90">{event.description}</div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
