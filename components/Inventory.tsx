import React, { useState } from 'react';
import { Search, Filter, Trash2, Edit2 } from 'lucide-react';
import { Item, Category, Location } from '../types';

interface InventoryProps {
  items: Item[];
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, onDelete }) => {
  const [filter, setFilter] = useState<'all' | 'fridge' | 'pantry'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'fridge' ? (item.location === 'Fridge' || item.location === 'Freezer')
      : (item.location === 'Pantry');
    return matchesSearch && matchesFilter;
  });

  const getExpiryStatus = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Expired', color: 'text-red-600 bg-red-100', days: diffDays };
    if (diffDays <= 3) return { label: `${diffDays} days left`, color: 'text-yellow-700 bg-yellow-100', days: diffDays };
    return { label: `${diffDays} days`, color: 'text-emerald-700 bg-emerald-100', days: diffDays };
  };

  return (
    <div className="h-full flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-2 sticky top-0 z-10 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">My Items</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search milk, eggs..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          {['all', 'fridge', 'pantry'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No items found.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const status = getExpiryStatus(item.expiryDate);
            return (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {item.quantity} {item.unit} • {item.location} • {item.category}
                  </p>
                  <p className="text-xs text-gray-400">
                    Expires: {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Inventory;
