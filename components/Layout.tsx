import React from 'react';
import { Home, Package, PlusCircle, Utensils, ClipboardList } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenAdd: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate, onOpenAdd }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'items', icon: Package, label: 'Items' },
    { id: 'add', icon: PlusCircle, label: '', isAction: true },
    { id: 'meals', icon: Utensils, label: 'Meals' },
    { id: 'tasks', icon: ClipboardList, label: 'Tasks' },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center px-2 py-2 pb-safe z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={onOpenAdd}
                className="transform -translate-y-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
              >
                <PlusCircle size={28} />
              </button>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-14 space-y-1 transition-colors ${
                activeTab === item.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
