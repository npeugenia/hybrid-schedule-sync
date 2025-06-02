
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Event, EventType, eventTypeConfigs } from '../../types/Event';
import { Calendar, Clock, Trash2 } from 'lucide-react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event | Omit<Event, 'id'>) => void;
  onDelete?: (eventId: string) => void;
  selectedDate: Date | null;
  editingEvent?: Event | null;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  editingEvent
}) => {
  const [eventType, setEventType] = useState<EventType>('telework');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setEventType(editingEvent.type);
        setDate(editingEvent.date.toISOString().split('T')[0]);
        setStartTime(editingEvent.startTime);
        setEndTime(editingEvent.endTime);
        setComment(editingEvent.comment || '');
      } else if (selectedDate) {
        setDate(selectedDate.toISOString().split('T')[0]);
        setEventType('telework');
        setStartTime('09:00');
        setEndTime('17:30');
        setComment('');
      }
    }
  }, [isOpen, editingEvent, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      date: new Date(date),
      type: eventType,
      startTime,
      endTime,
      comment: comment.trim() || undefined
    };

    if (editingEvent) {
      onSave({ ...eventData, id: editingEvent.id });
    } else {
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
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full"
            />
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
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
