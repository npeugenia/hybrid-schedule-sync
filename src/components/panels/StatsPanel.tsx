
import React from 'react';
import { Card } from '@/components/ui/card';
import { Event } from '../../types/Event';
import { TrendingUp, Home, Building, Calendar } from 'lucide-react';

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
      borderColor: 'border-blue-200'
    },
    {
      title: 'Présentiel',
      value: officeDays,
      percentage: officePercentage,
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Total jours',
      value: totalWorkDays,
      percentage: 100,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Statistiques du mois</h3>
        <TrendingUp className="w-5 h-5 text-slate-400" />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`p-4 border ${stat.borderColor} ${stat.bgColor} hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold ${stat.color}`}>
                  {stat.percentage}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Répartition mensuelle</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Télétravail</span>
            <span>{teleworkPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${teleworkPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-slate-600">
            <span>Présentiel</span>
            <span>{officePercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${officePercentage}%` }}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  );
};
