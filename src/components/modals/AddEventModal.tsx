
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Event, EventType, eventTypeConfigs } from '../../types/Event';
import { Calendar, Clock, Trash2, CalendarRange, CalendarDays, ArrowRight } from 'lucide-react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event | Omit<Event, 'id'>) => void;
  onSaveMultiple?: (events: Omit<Event, 'id'>[]) => void;
  onDelete?: (eventId: string) => void;
  selectedDate: Date | null;
  editingEvent?: Event | null;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onSaveMultiple,
  onDelete,
  selectedDate,
  editingEvent
}) => {
  const [eventType, setEventType] = useState<EventType>('telework');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [comment, setComment] = useState('');
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setEventType(editingEvent.type);
        setDate(editingEvent.date.toISOString().split('T')[0]);
        setStartTime(editingEvent.startTime);
        setEndTime(editingEvent.endTime);
        setComment(editingEvent.comment || '');
        setIsRangeMode(false);
        setEndDate('');
      } else if (selectedDate) {
        setDate(selectedDate.toISOString().split('T')[0]);
        setEventType('telework');
        setStartTime('09:00');
        setEndTime('17:30');
        setComment('');
        setIsRangeMode(false);
        setEndDate('');
      }
    }
  }, [isOpen, editingEvent, selectedDate]);

  const generateDateRange = (startDate: string, endDate: string): Date[] => {
    const dates: Date[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      // Mode édition - un seul événement
      const eventData = {
        date: new Date(date),
        type: eventType,
        startTime,
        endTime,
        comment: comment.trim() || undefined,
        id: editingEvent.id
      };
      onSave(eventData);
      return;
    }

    if (isRangeMode && endDate && onSaveMultiple) {
      // Mode plage de dates
      const dateRange = generateDateRange(date, endDate);
      const events = dateRange.map(dateObj => ({
        date: dateObj,
        type: eventType,
        startTime,
        endTime,
        comment: comment.trim() || undefined
      }));
      onSaveMultiple(events);
    } else {
      // Mode date unique
      const eventData = {
        date: new Date(date),
        type: eventType,
        startTime,
        endTime,
        comment: comment.trim() || undefined
      };
      onSave(eventData);
    }
  };

  const handleDelete = () => {
    if (editingEvent && onDelete) {
      onDelete(editingEvent.id);
    }
  };

  // Calcul automatique de la date de fin suggérée (fin de semaine)
  const getSuggestedEndDate = () => {
    if (!date) return '';
    const startDate = new Date(date);
    const dayOfWeek = startDate.getDay();
    const daysUntilFriday = dayOfWeek === 0 ? 5 : (5 - dayOfWeek + 7) % 7;
    const suggestedEnd = new Date(startDate);
    suggestedEnd.setDate(startDate.getDate() + daysUntilFriday);
    return suggestedEnd.toISOString().split('T')[0];
  };

  const formatDateRange = () => {
    if (!date || !endDate) return null;
    const start = new Date(date);
    const end = new Date(endDate);
    const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      dayCount,
      startFormatted: start.toLocaleDateString('fr-FR', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      }),
      endFormatted: end.toLocaleDateString('fr-FR', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      })
    };
  };

  const isEditing = !!editingEvent;
  const rangeInfo = formatDateRange();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header fixe */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white">
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>
                {isEditing ? 'Modifier le jour' : 'Ajouter un jour'}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Mode de sélection - uniquement en mode ajout */}
                  {!isEditing && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-slate-700">Mode de sélection</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setIsRangeMode(false)}
                          className={`
                            flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                            ${!isRangeMode 
                              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                            }
                          `}
                        >
                          <CalendarDays className="w-5 h-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium text-sm">Date unique</div>
                            <div className="text-xs opacity-75">Un jour spécifique</div>
                          </div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setIsRangeMode(true)}
                          className={`
                            flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                            ${isRangeMode 
                              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                            }
                          `}
                        >
                          <CalendarRange className="w-5 h-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium text-sm">Plage de dates</div>
                            <div className="text-xs opacity-75">Plusieurs jours</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sélection des dates */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-slate-700">
                        {isRangeMode ? 'Période' : 'Date'}
                      </Label>
                      {isRangeMode && rangeInfo && (
                        <span className="text-xs text-blue-600 font-medium">
                          {rangeInfo.dayCount} jour{rangeInfo.dayCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    {isRangeMode ? (
                      <div className="space-y-4">
                        {/* Date de début */}
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-xs text-slate-600">Date de début</Label>
                          <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => {
                              setDate(e.target.value);
                              // Auto-suggérer la date de fin si elle n'est pas définie
                              if (!endDate && e.target.value) {
                                setEndDate(getSuggestedEndDate());
                              }
                            }}
                            required
                            className="w-full"
                          />
                        </div>

                        {/* Flèche indicative */}
                        <div className="flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>

                        {/* Date de fin */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="endDate" className="text-xs text-slate-600">Date de fin</Label>
                            {date && (
                              <button
                                type="button"
                                onClick={() => setEndDate(getSuggestedEndDate())}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Fin de semaine
                              </button>
                            )}
                          </div>
                          <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={date}
                            required
                            className="w-full"
                          />
                        </div>

                        {/* Aperçu de la plage */}
                        {rangeInfo && (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-blue-900">
                                  {rangeInfo.startFormatted} → {rangeInfo.endFormatted}
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                  {rangeInfo.dayCount} jour{rangeInfo.dayCount > 1 ? 's' : ''} sélectionné{rangeInfo.dayCount > 1 ? 's' : ''}
                                </p>
                              </div>
                              <CalendarRange className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Input
                        id="single-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full"
                      />
                    )}
                  </div>

                  {/* Type d'événement */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Type de journée</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(eventTypeConfigs).map(([type, config]) => (
                        <label
                          key={type}
                          className={`
                            flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all
                            ${eventType === type 
                              ? `${config.bgColor} border-current` 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="eventType"
                            value={type}
                            checked={eventType === type}
                            onChange={(e) => setEventType(e.target.value as EventType)}
                            className="sr-only"
                          />
                          <span className="text-lg mr-2">{config.icon}</span>
                          <span className={`font-medium ${eventType === type ? config.color : 'text-slate-700'}`}>
                            {config.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Horaires */}
                  {(eventType === 'telework' || eventType === 'office') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Début</span>
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Fin</span>
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Commentaire */}
                  <div className="space-y-2">
                    <Label htmlFor="comment">Commentaire (optionnel)</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Réunion équipe, formation..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  {/* Espace pour éviter que le contenu soit caché par les boutons */}
                  <div className="h-20"></div>
                </form>
              </div>
            </ScrollArea>
          </div>

          {/* Actions fixes en bas */}
          <div className="px-6 py-4 border-t bg-white">
            <div className="flex justify-between">
              <div>
                {isEditing && onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmit}
                >
                  {isEditing ? 'Mettre à jour' : isRangeMode ? 'Ajouter la plage' : 'Ajouter'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
