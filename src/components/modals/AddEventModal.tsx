
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Event, EventType, eventTypeConfigs } from '../../types/Event';
import { Calendar, Clock, Trash2, CalendarRange } from 'lucide-react';

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

  const isEditing = !!editingEvent;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>
              {isEditing ? 'Modifier le jour' : 'Ajouter un jour'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mode de sélection - uniquement en mode ajout */}
          {!isEditing && (
            <div className="space-y-3">
              <Label>Mode de sélection</Label>
              <div className="flex space-x-3">
                <label
                  className={`
                    flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all flex-1
                    ${!isRangeMode 
                      ? 'bg-blue-100 border-blue-300 text-blue-700' 
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="selectionMode"
                    checked={!isRangeMode}
                    onChange={() => setIsRangeMode(false)}
                    className="sr-only"
                  />
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">Date unique</span>
                </label>
                
                <label
                  className={`
                    flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all flex-1
                    ${isRangeMode 
                      ? 'bg-blue-100 border-blue-300 text-blue-700' 
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="selectionMode"
                    checked={isRangeMode}
                    onChange={() => setIsRangeMode(true)}
                    className="sr-only"
                  />
                  <CalendarRange className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">Plage de dates</span>
                </label>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className={isRangeMode ? 'grid grid-cols-2 gap-4' : 'space-y-2'}>
            <div className="space-y-2">
              <Label htmlFor="date">
                {isRangeMode ? 'Date de début' : 'Date'}
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            {isRangeMode && (
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
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
            )}
          </div>

          {/* Type d'événement */}
          <div className="space-y-3">
            <Label>Type de journée</Label>
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

          {/* Prévisualisation de la plage */}
          {isRangeMode && date && endDate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">
                Plage sélectionnée : {generateDateRange(date, endDate).length} jour(s)
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Du {new Date(date).toLocaleDateString('fr-FR')} au {new Date(endDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
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
              >
                {isEditing ? 'Mettre à jour' : isRangeMode ? 'Ajouter la plage' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
