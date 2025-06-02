
import React from 'react';
import { Event, eventTypeConfigs } from '../../types/Event';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  compact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onClick, 
  compact = false 
}) => {
  const config = eventTypeConfigs[event.type];

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        border rounded-md cursor-pointer transition-all duration-200 
        hover:shadow-md hover:scale-105 transform
        ${config.bgColor} ${config.color}
        ${compact ? 'p-1.5' : 'p-3'}
      `}
    >
      <div className="flex items-center space-x-2">
        <span className={compact ? 'text-xs' : 'text-sm'}>
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${compact ? 'text-xs' : 'text-sm'}`}>
            {config.label}
          </p>
          {!compact && (
            <p className="text-xs opacity-80 mt-1">
              {event.startTime} - {event.endTime}
            </p>
          )}
          {event.comment && !compact && (
            <p className="text-xs opacity-70 mt-1 truncate">
              {event.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
