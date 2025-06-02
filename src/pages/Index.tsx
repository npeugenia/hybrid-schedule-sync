import React, { useState, useEffect } from 'react';
import { CalendarView } from '../components/calendar/CalendarView';
import { Dashboard } from '../components/dashboard/Dashboard';
import { AddEventModal } from '../components/modals/AddEventModal';
import { MainLayout } from '../components/layout/MainLayout';
import { StatsPanel } from '../components/panels/StatsPanel';
import { QuickActionsPanel } from '../components/panels/QuickActionsPanel';
import { Event } from '../types/Event';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentView, setCurrentView] = useState<'calendar' | 'dashboard'>('dashboard');

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
    <MainLayout
      currentView={currentView}
      setCurrentView={setCurrentView}
      onAddEvent={() => openAddModal()}
    >
      <div className="h-full">
        {currentView === 'dashboard' ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Panel principal - Tableau de bord */}
            <ResizablePanel defaultSize={65} minSize={50}>
              <div className="h-full pr-3">
                <Dashboard events={events} />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Panel latéral - Statistiques et actions */}
            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full pl-3 space-y-6">
                <StatsPanel events={events} />
                <QuickActionsPanel onAddEvent={() => openAddModal()} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Panel principal - Calendrier */}
            <ResizablePanel defaultSize={75} minSize={60}>
              <div className="h-full pr-3">
                <CalendarView
                  events={events}
                  onDateClick={openAddModal}
                  onEventClick={openEditModal}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Panel latéral - Statistiques */}
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="h-full pl-3">
                <StatsPanel events={events} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

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
    </MainLayout>
  );
};

export default Index;
