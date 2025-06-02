
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Download, Calendar, Repeat } from 'lucide-react';

interface QuickActionsPanelProps {
  onAddEvent: () => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ onAddEvent }) => {
  const quickActions = [
    {
      title: 'Télétravail aujourd\'hui',
      description: 'Marquer la journée en télétravail',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      action: () => onAddEvent()
    },
    {
      title: 'Présentiel aujourd\'hui',
      description: 'Marquer la journée en présentiel',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      action: () => onAddEvent()
    },
    {
      title: 'Pattern récurrent',
      description: 'Appliquer un modèle sur plusieurs jours',
      icon: Repeat,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      action: () => onAddEvent()
    },
    {
      title: 'Exporter planning',
      description: 'Télécharger le planning au format PDF',
      icon: Download,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      action: () => console.log('Export planning')
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Actions rapides</h3>
      
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <Card key={index} className={`p-4 ${action.bgColor} border-0 hover:shadow-md transition-all duration-200 cursor-pointer`}>
            <Button
              variant="ghost"
              className={`w-full justify-start p-0 h-auto ${action.hoverColor}`}
              onClick={action.action}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className={`p-2 rounded-lg bg-white ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900">{action.title}</p>
                  <p className="text-xs text-slate-600">{action.description}</p>
                </div>
              </div>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
