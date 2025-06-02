
import React from 'react';
import { Card } from '@/components/ui/card';
import { Event } from '../../types/Event';
import { TrendingUp, Home, Building, Calendar, Target } from 'lucide-react';

interface StatsPanelProps {
  events: Event[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ events }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthEvents = events.filter(event => 
    event.date.getMonth() === currentMonth && 
    event.date.getFullYear() === currentYear
  );

  const teleworkDays = monthEvents.filter(e => e.type === 'telework').length;
  const officeDays = monthEvents.filter(e => e.type === 'office').length;
  const totalWorkDays = teleworkDays + officeDays;
  
  const teleworkPercentage = totalWorkDays > 0 ? Math.round((teleworkDays / totalWorkDays) * 100) : 0;
  const officePercentage = totalWorkDays > 0 ? Math.round((officeDays / totalWorkDays) * 100) : 0;

  const stats = [
    {
      title: 'Télétravail',
      value: teleworkDays,
      percentage: teleworkPercentage,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      accentColor: 'bg-blue-500'
    },
    {
      title: 'Présentiel',
      value: officeDays,
      percentage: officePercentage,
      icon: Building,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      accentColor: 'bg-emerald-500'
    },
    {
      title: 'Total jours',
      value: totalWorkDays,
      percentage: 100,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      accentColor: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-heading-2 font-semibold text-slate-900">Statistiques</h3>
          <p className="text-caption text-slate-500 mt-1">Aperçu du mois en cours</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-100">
          <TrendingUp className="w-5 h-5 text-slate-600" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`p-5 border-2 ${stat.borderColor} ${stat.bgColor} hover:shadow-medium transition-all duration-200 animate-scale-in`} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-white shadow-soft ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-label font-medium text-slate-700">{stat.title}</p>
                  <p className={`text-heading-1 font-bold ${stat.color} text-mono`}>{stat.value}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${stat.color} text-mono`}>
                  {stat.percentage}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Visualization */}
      <Card className="p-6 bg-white border-slate-200 shadow-soft">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-5 h-5 text-slate-600" />
          <h4 className="text-heading-3 font-medium text-slate-900">Répartition mensuelle</h4>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-label text-slate-700 font-medium">Télétravail</span>
              <span className="text-caption font-semibold text-blue-600 text-mono">{teleworkPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${teleworkPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-label text-slate-700 font-medium">Présentiel</span>
              <span className="text-caption font-semibold text-emerald-600 text-mono">{officePercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${officePercentage}%`, animationDelay: '200ms' }}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
