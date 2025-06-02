
import React, { useState, useEffect } from 'react';
import { CalendarView } from '../components/calendar/CalendarView';
import { Dashboard } from '../components/dashboard/Dashboard';
import { AddEventModal } from '../components/modals/AddEventModal';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { Event, EventType } from '../types/Event';

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentView, setCurrentView] = useState<'calendar' | 'dashboard'>('calendar');

  // Charger les événements depuis localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('hybrid-work-events');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date),
        startTime: event.startTime,
        endTime: event.endTime
      }));
      setEvents(parsedEvents);
    }
  }, []);

  // Sauvegarder les événements dans localStorage
  useEffect(() => {
    localStorage.setItem('hybrid-work-events', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleAddMultipleEvents = (eventList: Omit<Event, 'id'>[]) => {
    const newEvents: Event[] = eventList.map((event, index) => ({
      ...event,
      id: (Date.now() + index).toString()
    }));
    setEvents(prev => [...prev, ...newEvents]);
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleEditEvent = (event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const openAddModal = (date?: Date) => {
    setSelectedDate(date || new Date());
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-slate-900">
                WorkFlow Hybrid
              </h1>
              <div className="hidden sm:flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentView === 'calendar'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Calendrier
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tableau de bord
                </button>
              </div>
            </div>
            
            <Button
              onClick={() => openAddModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un jour
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'calendar' ? (
          <CalendarView
            events={events}
            onDateClick={openAddModal}
            onEventClick={openEditModal}
          />
        ) : (
          <Dashboard events={events} />
        )}
      </main>

      {/* Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
          setEditingEvent(null);
        }}
        onSave={editingEvent ? handleEditEvent : handleAddEvent}
        onSaveMultiple={handleAddMultipleEvents}
        onDelete={handleDeleteEvent}
        selectedDate={selectedDate}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default Index;
