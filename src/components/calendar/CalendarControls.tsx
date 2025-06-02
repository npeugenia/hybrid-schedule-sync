
import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarControlsProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange?: (view: 'month' | 'week') => void;
  currentView?: 'month' | 'week';
}

export const CalendarControls: React.FC<CalendarControlsProps> = ({
  currentDate,
  onDateChange,
  onViewChange,
  currentView = 'month'
}) => {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-slate-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="px-3"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Aujourd'hui
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {onViewChange && (
        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                currentView === 'month'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                currentView === 'week'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semaine
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
