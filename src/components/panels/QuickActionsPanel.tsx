
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Download, Calendar, Repeat, Zap } from 'lucide-react';

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
      borderColor: 'border-blue-100',
      iconBg: 'bg-blue-500',
      action: () => onAddEvent()
    },
    {
      title: 'Présentiel aujourd\'hui',
      description: 'Marquer la journée en présentiel',
      icon: Calendar,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100',
      borderColor: 'border-emerald-100',
      iconBg: 'bg-emerald-500',
      action: () => onAddEvent()
    },
    {
      title: 'Pattern récurrent',
      description: 'Appliquer un modèle sur plusieurs jours',
      icon: Repeat,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      borderColor: 'border-purple-100',
      iconBg: 'bg-purple-500',
      action: () => onAddEvent()
    },
    {
      title: 'Exporter planning',
      description: 'Télécharger le planning au format PDF',
      icon: Download,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      borderColor: 'border-orange-100',
      iconBg: 'bg-orange-500',
      action: () => console.log('Export planning')
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-heading-2 font-semibold text-slate-900">Actions rapides</h3>
          <p className="text-caption text-slate-500 mt-1">Raccourcis pour gagner du temps</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className={`p-0 border-2 ${action.borderColor} ${action.bgColor} hover:shadow-medium transition-all duration-200 cursor-pointer animate-scale-in group`}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <Button
              variant="ghost"
              className={`w-full justify-start p-5 h-auto ${action.hoverColor} transition-all duration-200 rounded-xl`}
              onClick={action.action}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className={`p-3 rounded-xl ${action.iconBg} text-white shadow-soft group-hover:scale-105 transition-transform duration-200`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-label font-semibold text-slate-900 group-hover:text-slate-800">{action.title}</p>
                  <p className="text-caption text-slate-600 mt-0.5">{action.description}</p>
                </div>
              </div>
            </Button>
          </Card>
        ))}
      </div>

      {/* Quick Stats Summary */}
      <Card className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200 shadow-soft">
        <div className="text-center space-y-2">
          <p className="text-caption text-slate-600 font-medium">Cette semaine</p>
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <p className="text-heading-1 font-bold text-blue-600 text-mono">3</p>
              <p className="text-xs text-slate-500">Télétravail</p>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div className="text-center">
              <p className="text-heading-1 font-bold text-emerald-600 text-mono">2</p>
              <p className="text-xs text-slate-500">Présentiel</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
