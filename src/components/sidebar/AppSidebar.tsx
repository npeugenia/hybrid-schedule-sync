
import React from 'react';
import { Calendar, BarChart3, Settings, Home, Clock } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  currentView: 'calendar' | 'dashboard';
  setCurrentView: (view: 'calendar' | 'dashboard') => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  setCurrentView
}) => {
  const menuItems = [
    {
      title: 'Vue d\'ensemble',
      icon: Home,
      id: 'dashboard' as const,
      description: 'Tableau de bord'
    },
    {
      title: 'Calendrier',
      icon: Calendar,
      id: 'calendar' as const,
      description: 'Planning détaillé'
    },
    {
      title: 'Statistiques',
      icon: BarChart3,
      id: 'stats' as const,
      description: 'Analyses'
    },
    {
      title: 'Horaires',
      icon: Clock,
      id: 'schedule' as const,
      description: 'Gestion des créneaux'
    }
  ];

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-6 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">WorkFlow</h1>
            <p className="text-xs text-slate-500">Hybrid Work Manager</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => {
                      if (item.id === 'dashboard' || item.id === 'calendar') {
                        setCurrentView(item.id);
                      }
                    }}
                    isActive={currentView === item.id}
                    className={`w-full justify-start p-3 rounded-lg transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-slate-500">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Paramètres
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start p-3 rounded-lg hover:bg-slate-50 text-slate-700">
                  <Settings className="w-5 h-5 mr-3" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Préférences</span>
                    <span className="text-xs text-slate-500">Configuration</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
