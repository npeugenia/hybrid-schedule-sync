import React from 'react';
import { Event, EventType, eventTypeConfigs } from '../../types/Event';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, Calendar, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  events: Event[];
}

export const Dashboard: React.FC<DashboardProps> = ({ events }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Filtrer les événements du mois actuel
  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });

  // Calculer les statistiques
  const getEventStats = () => {
    const stats: Record<EventType, number> = {
      telework: 0,
      office: 0,
      vacation: 0,
      rest: 0
    };

    currentMonthEvents.forEach(event => {
      stats[event.type]++;
    });

    return stats;
  };

  const getTotalHours = () => {
    let totalMinutes = 0;
    
    currentMonthEvents.forEach(event => {
      if (event.type === 'telework' || event.type === 'office') {
        const start = new Date(`2000-01-01 ${event.startTime}`);
        const end = new Date(`2000-01-01 ${event.endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const dayMinutes = diffMs / (1000 * 60);
        
        // Déduire 1h30 (90 minutes) de pause déjeuner par jour de travail
        const workMinutes = dayMinutes - 90;
        totalMinutes += Math.max(workMinutes, 0); // S'assurer que le résultat n'est pas négatif
      }
    });

    return Math.round(totalMinutes / 60 * 10) / 10; // Arrondir à 1 décimale
  };

  const getWorkBalance = () => {
    const stats = getEventStats();
    const workDays = stats.telework + stats.office;
    if (workDays === 0) return { telework: 0, office: 0 };
    
    return {
      telework: Math.round((stats.telework / workDays) * 100),
      office: Math.round((stats.office / workDays) * 100)
    };
  };

  const getUpcomingWeek = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lundi = début de semaine
    startOfWeek.setDate(diff);

    const weekEvents = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayEvents = events.filter(event => 
        event.date.toDateString() === date.toDateString()
      );
      weekEvents.push({ date, events: dayEvents });
    }

    return weekEvents;
  };

  const stats = getEventStats();
  const totalHours = getTotalHours();
  const balance = getWorkBalance();
  const upcomingWeek = getUpcomingWeek();
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                     'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Tableau de bord</h2>
        <p className="text-blue-100">
          Aperçu de votre planning hybride pour {monthNames[currentMonth]} {currentYear}
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Jours télétravail
            </CardTitle>
            <div className="text-2xl">🏠</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.telework}</div>
            <p className="text-xs text-slate-500 mt-1">
              {balance.telework}% du temps de travail
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Jours présentiel
            </CardTitle>
            <div className="text-2xl">🏢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.office}</div>
            <p className="text-xs text-slate-500 mt-1">
              {balance.office}% du temps de travail
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total heures
            </CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalHours}h</div>
            <p className="text-xs text-slate-500 mt-1">
              Temps de travail effectif (pause déjeuner déduite)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Jours de congé
            </CardTitle>
            <div className="text-2xl">🌴</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.vacation}</div>
            <p className="text-xs text-slate-500 mt-1">
              Congés prévus ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Planning de la semaine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Planning de la semaine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {upcomingWeek.map((day, index) => {
              const isToday = day.date.toDateString() === currentDate.toDateString();
              const dayEvent = day.events[0];
              
              return (
                <div key={index} className={`text-center p-3 rounded-lg border ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`text-sm font-medium ${
                    isToday ? 'text-blue-600' : 'text-slate-600'
                  }`}>
                    {dayNames[index]}
                  </div>
                  <div className={`text-lg font-bold mt-1 ${
                    isToday ? 'text-blue-800' : 'text-slate-900'
                  }`}>
                    {day.date.getDate()}
                  </div>
                  <div className="mt-2">
                    {dayEvent ? (
                      <div className={`text-2xl ${
                        dayEvent.type === 'telework' ? 'title="Télétravail"' :
                        dayEvent.type === 'office' ? 'title="Présentiel"' :
                        dayEvent.type === 'vacation' ? 'title="Congé"' : 'title="Repos"'
                      }`}>
                        {eventTypeConfigs[dayEvent.type].icon}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm">-</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Répartition visuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Répartition télétravail/présentiel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Télétravail</span>
              </div>
              <span className="text-sm font-medium">{stats.telework} jours ({balance.telework}%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${balance.telework}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Présentiel</span>
              </div>
              <span className="text-sm font-medium">{stats.office} jours ({balance.office}%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${balance.office}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
