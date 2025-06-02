
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../sidebar/AppSidebar';
import { Button } from '@/components/ui/button';
import { Plus, Bell, Search } from 'lucide-react';

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
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar currentView={currentView} setCurrentView={setCurrentView} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="lg:hidden" />
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 w-64"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 bg-white hover:bg-slate-50"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </Button>
                
                <Button
                  onClick={onAddEvent}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Ajouter</span>
                  <span className="sm:hidden">+</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
