'use client';

import React from 'react';
import { format } from 'date-fns';
import { CalendarView } from '@/types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreateEvent: () => void;
}

export default function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onCreateEvent,
}: CalendarHeaderProps) {
  const getDateDisplay = () => {
    switch (view) {
      case CalendarView.MONTH:
        return format(currentDate, 'MMMM yyyy');
      case CalendarView.WEEK:
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
      case CalendarView.DAY:
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="bg-white shadow-sm border-b p-4">
      <div className="flex items-center justify-between">
        {/* Left section - Title and navigation */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">2026 Calendar</h1>
          <button
            onClick={onToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevious}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Previous"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-lg font-semibold text-gray-800 min-w-[200px] text-center">
              {getDateDisplay()}
            </span>
            <button
              onClick={onNext}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Next"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right section - View selector and create button */}
        <div className="flex items-center gap-4">
          {/* View selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange(CalendarView.MONTH)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === CalendarView.MONTH
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => onViewChange(CalendarView.WEEK)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === CalendarView.WEEK
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => onViewChange(CalendarView.DAY)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === CalendarView.DAY
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day
            </button>
          </div>

          {/* Create event button */}
          <button
            onClick={onCreateEvent}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
