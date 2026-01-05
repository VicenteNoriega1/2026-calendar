'use client';

import React, { useState, useEffect } from 'react';
import CalendarHeader from '@/components/Calendar/CalendarHeader';
import MonthView from '@/components/Calendar/MonthView';
import WeekView from '@/components/Calendar/WeekView';
import DayView from '@/components/Calendar/DayView';
import EventModal from '@/components/Events/EventModal';
import NaturalLanguageInput from '@/components/AI/NaturalLanguageInput';
import { useCalendar } from '@/hooks/useCalendar';
import { useEvents } from '@/hooks/useEvents';
import { useMCP } from '@/hooks/useMCP';
import { CalendarView } from '@/types/calendar';
import { CalendarEvent, EventPayload } from '@/types/event';

export default function Home() {
  const {
    state: calendarState,
    setView,
    setCurrentDate,
    setSelectedDate,
    setSelectedEvent,
    goToToday,
    goToNext,
    goToPrevious,
  } = useCalendar(new Date(2026, 0, 1));

  const {
    events,
    loading: eventsLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvent,
  } = useEvents();

  const { context: mcpContext, loading: mcpLoading } = useMCP();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();

  // Handle create event
  const handleCreateEvent = (date?: Date) => {
    setEditingEvent(undefined);
    setModalInitialDate(date || calendarState.currentDate);
    setIsEventModalOpen(true);
  };

  // Handle edit event
  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalInitialDate(undefined);
    setIsEventModalOpen(true);
  };

  // Handle save event
  const handleSaveEvent = (payload: EventPayload) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
    } else {
      createEvent(payload);
    }
    setIsEventModalOpen(false);
    setEditingEvent(undefined);
  };

  // Handle delete event
  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setIsEventModalOpen(false);
    setEditingEvent(undefined);
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setView(CalendarView.DAY);
  };

  // Handle time slot click
  const handleTimeSlotClick = (date: Date, hour?: number) => {
    const eventDate = new Date(date);
    if (hour !== undefined) {
      eventDate.setHours(hour, 0, 0, 0);
    }
    handleCreateEvent(eventDate);
  };

  // Handle AI event creation
  const handleAIEventCreated = (event: CalendarEvent) => {
    // Event is already created by the AI, just close any modals
    console.log('AI created event:', event);
  };

  // Loading state
  if (eventsLoading || mcpLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <CalendarHeader
        currentDate={calendarState.currentDate}
        view={calendarState.view}
        onViewChange={setView}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onCreateEvent={() => handleCreateEvent()}
      />

      {/* Main content */}
      <div className="container mx-auto p-6 space-y-6">
        {/* AI Natural Language Input */}
        <NaturalLanguageInput
          onEventCreated={handleAIEventCreated}
          contextEvents={events}
        />

        {/* Calendar View */}
        <div className="animate-fade-in">
          {calendarState.view === CalendarView.MONTH && (
            <MonthView
              currentDate={calendarState.currentDate}
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}
          {calendarState.view === CalendarView.WEEK && (
            <WeekView
              currentDate={calendarState.currentDate}
              events={events}
              onEventClick={handleEventClick}
              onTimeSlotClick={(date, hour) => handleTimeSlotClick(date, hour)}
            />
          )}
          {calendarState.view === CalendarView.DAY && (
            <DayView
              currentDate={calendarState.currentDate}
              events={events}
              onEventClick={handleEventClick}
              onTimeSlotClick={(hour) => handleTimeSlotClick(calendarState.currentDate, hour)}
            />
          )}
        </div>

        {/* Event count and summary */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-800">{events.length}</p>
            </div>
            <div className="text-sm text-gray-600">
              {mcpContext && (
                <p>
                  Timezone: <span className="font-semibold">{mcpContext.timezone}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={editingEvent}
        initialDate={modalInitialDate}
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(undefined);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </main>
  );
}
