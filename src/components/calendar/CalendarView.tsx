
import React, { useState } from 'react';
import { CalendarControls } from './CalendarControls';
import { EventCard } from './EventCard';
import { Event } from '../../types/Event';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onDateClick,
  onEventClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Jours du mois suivant pour compléter la grille
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const today = new Date();
  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* En-tête du calendrier */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grille du calendrier */}
      <div className="p-6">
        {/* Noms des jours */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center font-semibold text-slate-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Jours du mois */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date);
            const isCurrentDay = isToday(day.date);
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  day.isCurrentMonth
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                } ${
                  isCurrentDay ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                onClick={() => onDateClick(day.date)}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentDay 
                    ? 'text-blue-600 font-bold' 
                    : day.isCurrentMonth 
                    ? 'text-slate-900' 
                    : 'text-slate-400'
                }`}>
                  {day.date.getDate()}
                  {isCurrentDay && (
                    <span className="ml-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                      Aujourd'hui
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                      compact
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
