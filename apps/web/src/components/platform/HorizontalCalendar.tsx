'use client';

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Languages } from 'lucide-react';

// Calendar Events Data
interface CalendarEvent {
  id: string;
  type: 'FOMC' | 'EARNINGS' | 'ECONOMIC';
  title: string;
  date: string;
  time?: string;
  ticker?: string;
  description: string;
  transcript?: string;
}

const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: '1', type: 'FOMC', title: 'FOMC Meeting', date: '2025-01-29', time: '14:00', description: 'Federal Open Market Committee meeting - Interest rate decision expected' },
  { id: '2', type: 'EARNINGS', title: 'AAPL Earnings Call', date: '2025-01-08', time: '16:30', ticker: 'AAPL', description: 'Apple Q4 2024 earnings call', transcript: 'Thank you for joining us today. We are pleased to report record Q4 results with revenue of $123.9 billion...' },
  { id: '3', type: 'EARNINGS', title: 'TSLA Earnings Call', date: '2025-01-09', time: '17:30', ticker: 'TSLA', description: 'Tesla Q4 2024 earnings call', transcript: 'Good afternoon everyone. Tesla delivered strong results this quarter with 485,000 vehicles delivered...' },
  { id: '4', type: 'ECONOMIC', title: 'CPI Release', date: '2025-01-11', time: '08:30', description: 'Consumer Price Index data release' },
  { id: '5', type: 'EARNINGS', title: 'NVDA Earnings Call', date: '2025-01-15', time: '16:00', ticker: 'NVDA', description: 'NVIDIA Q4 2024 earnings call', transcript: 'Thank you for joining. NVIDIA had an exceptional quarter driven by AI demand. Revenue reached $18.1 billion...' },
  { id: '6', type: 'ECONOMIC', title: 'Retail Sales', date: '2025-01-16', time: '08:30', description: 'Retail sales data for December' },
  { id: '7', type: 'FOMC', title: 'Fed Minutes Release', date: '2025-01-20', time: '14:00', description: 'FOMC meeting minutes from December meeting' },
  { id: '8', type: 'EARNINGS', title: 'MSFT Earnings Call', date: '2025-01-23', time: '17:00', ticker: 'MSFT', description: 'Microsoft Q2 FY2025 earnings call', transcript: 'Good afternoon. Microsoft cloud services continue to drive growth with Azure revenue up 31% year-over-year...' },
];

interface HorizontalCalendarProps {
  onEventClick?: (event: CalendarEvent) => void;
  selectedEventId?: string | null;
}

export default function HorizontalCalendar({ onEventClick, selectedEventId }: HorizontalCalendarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Scroll by ~1.5 cards
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  const sortedEvents = CALENDAR_EVENTS.sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="relative bg-[#0A0A0C] border-b border-[#1A1A1F] py-4">
      <div className="px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-accent-cyan" />
            <h3 className="text-sm font-semibold text-text-primary">Economic Calendar</h3>
            <span className="text-xs text-text-tertiary">({sortedEvents.length} upcoming events)</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-lg border transition-all ${
                canScrollLeft
                  ? 'border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20'
                  : 'border-border-primary bg-background-secondary text-text-tertiary cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-lg border transition-all ${
                canScrollRight
                  ? 'border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20'
                  : 'border-border-primary bg-background-secondary text-text-tertiary cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-accent-cyan/20 scrollbar-track-transparent"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0, 229, 255, 0.2) transparent'
          }}
        >
          {sortedEvents.map(event => {
            const eventDate = new Date(event.date);
            const today = new Date();
            const isToday = eventDate.toDateString() === today.toDateString();
            const isPast = eventDate < today && !isToday;
            const isSelected = selectedEventId === event.id;

            return (
              <button
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className={`flex-shrink-0 w-[280px] p-4 rounded-lg border transition-all text-left ${
                  isSelected
                    ? 'border-accent-cyan bg-accent-cyan/10 shadow-lg shadow-accent-cyan/20'
                    : isPast
                    ? 'border-border-primary bg-background-secondary/50 opacity-60 hover:opacity-80'
                    : isToday
                    ? 'border-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/15'
                    : 'border-border-primary bg-background-secondary hover:border-accent-cyan/30 hover:bg-background-tertiary'
                }`}
              >
                {/* Event Type Badge and Ticker */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    event.type === 'FOMC' ? 'bg-accent-cyan/20 text-accent-cyan' :
                    event.type === 'EARNINGS' ? 'bg-accent-magenta/20 text-accent-magenta' :
                    'bg-accent-emerald/20 text-accent-emerald'
                  }`}>
                    {event.type}
                  </span>
                  {event.ticker && (
                    <span className="text-xs font-mono text-accent-cyan font-semibold">{event.ticker}</span>
                  )}
                  {isToday && (
                    <span className="ml-auto text-xs font-semibold text-accent-emerald">TODAY</span>
                  )}
                </div>

                {/* Event Title */}
                <h4 className="text-sm font-semibold text-text-primary mb-2 line-clamp-2">
                  {event.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                  {event.description}
                </p>

                {/* Date and Time */}
                <div className="flex items-center gap-2 text-xs text-text-tertiary mb-2">
                  <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  {event.time && (
                    <>
                      <span>•</span>
                      <span>{event.time}</span>
                    </>
                  )}
                </div>

                {/* AI Translation Badge */}
                {event.transcript && (
                  <div className="flex items-center gap-1 text-xs text-accent-cyan">
                    <Languages size={12} />
                    <span>AI Translation Available</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
