import React from 'react';
import { AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import StatsChart from './StatsChart';
import { Item, Recipe } from '../types';

interface DashboardProps {
  items: Item[];
  onNavigate: (tab: string) => void;
  recipes: Recipe[];
}

const Dashboard: React.FC<DashboardProps> = ({ items, onNavigate, recipes }) => {
  // Logic to calculate stats
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let fresh = 0;
  let soon = 0;
  let expired = 0;
  const urgentItems: { item: Item; daysDiff: number }[] = [];

  items.forEach(item => {
    const expiryDate = new Date(item.expiryDate);
    // Difference in milliseconds
    const diffTime = expiryDate.getTime() - today.getTime();
    // Difference in days (ceil to handle partial days as upcoming)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      expired++;
    } else if (diffDays <= 3) {
      soon++;
      urgentItems.push({ item, daysDiff: diffDays });
    } else {
      fresh++;
    }
  });

  // Sort urgent items by closest expiry
  urgentItems.sort((a, b) => a.daysDiff - b.daysDiff);

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ExpiryGuard</h1>
          <p className="text-sm text-gray-500">Welcome back!</p>
        </div>
        <div className="flex space-x-3">
           <button className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-50">
             <Calendar size={20} />
           </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mx-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Inventory Health</h2>
        <div className="flex items-center">
          <div className="w-1/2">
            <StatsChart fresh={fresh} soon={soon} expired={expired} />
          </div>
          <div className="w-1/2 space-y-2 pl-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>Fresh</span>
              <span className="font-bold">{fresh}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>Soon</span>
              <span className="font-bold">{soon}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>Expired</span>
              <span className="font-bold">{expired}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Items */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            Urgent Items
          </h3>
          <button 
            onClick={() => onNavigate('items')}
            className="text-sm text-blue-600 font-medium"
          >
            See All
          </button>
        </div>
        
        <div className="space-y-3">
          {urgentItems.length === 0 ? (
            <div className="bg-emerald-50 p-4 rounded-xl text-emerald-700 text-sm text-center">
              All good! Nothing expiring soon.
            </div>
          ) : (
            urgentItems.slice(0, 3).map(({ item, daysDiff }) => (
              <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl mr-3">
                    {item.category === 'Dairy' ? '🥛' : 
                     item.category === 'Fruits' ? '🍎' :
                     item.category === 'Vegetables' ? '🥬' : '📦'}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-xs text-red-500 font-medium">
                      {daysDiff < 0 ? `Expired ${Math.abs(daysDiff)} days ago` : 
                       daysDiff === 0 ? 'Expires today!' : 
                       `Expires in ${daysDiff} day${daysDiff > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-gray-600">
                  <ChevronRight size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions (Suggestions) */}
      <div className="px-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Suggested for You</h3>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold text-lg mb-1">Cook with what you have</h4>
            <p className="text-blue-100 text-sm mb-4">You have {urgentItems.length} items needing attention. Use them in a delicious meal!</p>
            <button 
              onClick={() => onNavigate('meals')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold shadow-md active:scale-95 transition-transform"
            >
              Get Recipe Ideas
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
             <span className="text-9xl">🍳</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
