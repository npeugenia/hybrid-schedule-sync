
export type EventType = 'telework' | 'office' | 'vacation' | 'rest';

export interface Event {
  id: string;
  date: Date;
  type: EventType;
  startTime: string;
  endTime: string;
  comment?: string;
}

export interface EventTypeConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

export const eventTypeConfigs: Record<EventType, EventTypeConfig> = {
  telework: {
    label: 'Télétravail',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-200',
    icon: '🏠'
  },
  office: {
    label: 'Présentiel',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
    icon: '🏢'
  },
  vacation: {
    label: 'Congé',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100 border-orange-200',
    icon: '🌴'
  },
  rest: {
    label: 'Repos',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100 border-gray-200',
    icon: '💤'
  }
};
