
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../sidebar/AppSidebar';
import { Button } from '@/components/ui/button';
import { Plus, Bell, Search, Settings } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: 'calendar' | 'dashboard';
  setCurrentView: (view: 'calendar' | 'dashboard') => void;
  onAddEvent: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentView,
  setCurrentView,
  onAddEvent
}) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50/50">
        <AppSidebar currentView={currentView} setCurrentView={setCurrentView} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <SidebarTrigger className="lg:hidden hover:bg-slate-100 transition-colors" />
                
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher dans le planning..."
                      className="pl-10 pr-4 py-2.5 bg-slate-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 w-80 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 transition-smooth"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-caption font-medium">Paramètres</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 transition-smooth relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-caption font-medium">Notifications</span>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </Button>
                
                <Button
                  onClick={onAddEvent}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-medium transition-all duration-200 font-medium"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Nouvel événement</span>
                  <span className="sm:hidden">Ajouter</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 custom-scrollbar overflow-auto">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
