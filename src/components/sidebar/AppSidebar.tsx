
import React from 'react';
import { Calendar, BarChart3, Settings, Home, Clock, Zap } from 'lucide-react';
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
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  currentView: 'calendar' | 'dashboard';
  setCurrentView: (view: 'calendar' | 'dashboard') => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  setCurrentView
}) => {
  const navigationItems = [
    {
      title: 'Tableau de bord',
      icon: Home,
      id: 'dashboard' as const,
      description: 'Vue d\'ensemble',
      active: currentView === 'dashboard'
    },
    {
      title: 'Calendrier',
      icon: Calendar,
      id: 'calendar' as const,
      description: 'Planning détaillé',
      active: currentView === 'calendar'
    }
  ];

  const toolsItems = [
    {
      title: 'Statistiques',
      icon: BarChart3,
      id: 'stats' as const,
      description: 'Analyses détaillées',
      disabled: true
    },
    {
      title: 'Horaires',
      icon: Clock,
      id: 'schedule' as const,
      description: 'Gestion des créneaux',
      disabled: true
    }
  ];

  return (
    <Sidebar className="border-r border-slate-200/60 bg-white/95 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b border-slate-100/60">
        <div className="flex items-center space-x-3 animate-slide-in-left">
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl flex items-center justify-center shadow-soft">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-heading-2 font-bold text-slate-900">WorkFlow</h1>
            <p className="text-caption text-slate-500 font-medium">Hybrid Work Manager</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setCurrentView(item.id)}
                    isActive={item.active}
                    className={`w-full justify-start p-3 rounded-xl transition-all duration-200 group ${
                      item.active
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-soft'
                        : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                      item.active ? 'text-primary' : 'text-slate-500 group-hover:text-slate-700'
                    }`} />
                    <div className="flex flex-col items-start">
                      <span className="text-label font-medium">{item.title}</span>
                      <span className="text-xs text-slate-500 font-normal">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
            Outils
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    disabled={item.disabled}
                    className={`w-full justify-start p-3 rounded-xl transition-all duration-200 group ${
                      item.disabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3 text-slate-400" />
                    <div className="flex flex-col items-start">
                      <span className="text-label font-medium text-slate-600">{item.title}</span>
                      <span className="text-xs text-slate-400 font-normal">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
            Compte
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-all duration-200 group">
                  <Settings className="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-700" />
                  <div className="flex flex-col items-start">
                    <span className="text-label font-medium">Préférences</span>
                    <span className="text-xs text-slate-500 font-normal">Configuration</span>
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
