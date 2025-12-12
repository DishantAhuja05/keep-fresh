import React, { useState, useRef } from 'react';
import { Camera, Type, Barcode, X, Loader2, Check } from 'lucide-react';
import { Item, Category, Location } from '../types';
import { analyzeImageForItem } from '../services/geminiService';

interface AddItemProps {
  onClose: () => void;
  onAdd: (item: Item) => void;
}

const CATEGORIES: Category[] = ['Dairy', 'Vegetables', 'Fruits', 'Meat & Fish', 'Pantry', 'Beverages', 'Frozen', 'Other'];
const LOCATIONS: Location[] = ['Fridge', 'Freezer', 'Pantry', 'Counter'];

const AddItem: React.FC<AddItemProps> = ({ onClose, onAdd }) => {
  const [mode, setMode] = useState<'manual' | 'scan' | 'photo'>('manual');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [expiryDate, setExpiryDate] = useState('');
  const [location, setLocation] = useState<Location>('Fridge');
  const [quantity, setQuantity] = useState(1);

  // Photo Analysis
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const detectedItems = await analyzeImageForItem(base64);
        
        if (detectedItems.length > 0) {
          const item = detectedItems[0];
          setName(item.name);
          setCategory(item.category as Category);
          setQuantity(item.quantity || 1);
          
          // Calculate estimated expiry date
          const today = new Date();
          const days = item.estimatedExpiryDays || 7;
          today.setDate(today.getDate() + days);
          setExpiryDate(today.toISOString().split('T')[0]);
          
          setMode('manual'); // Switch to review mode
        } else {
          alert('Could not identify food items.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to analyze photo.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const simulateScan = () => {
    setLoading(true);
    setTimeout(() => {
      setName('Heinz Ketchup');
      setCategory('Pantry');
      setLocation('Pantry');
      setExpiryDate('2025-06-12');
      setQuantity(1);
      setLoading(false);
      setMode('manual');
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !expiryDate) return;

    const newItem: Item = {
      id: Date.now().toString(),
      name,
      category,
      quantity,
      unit: 'pcs',
      location,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate,
    };
    onAdd(newItem);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md h-[90vh] sm:h-auto rounded-t-2xl sm:rounded-2xl flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Add New Item</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-3 gap-2 p-4">
          <button 
            onClick={() => setMode('scan')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border ${mode === 'scan' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}
          >
            <Barcode size={24} className="mb-1" />
            <span className="text-xs font-medium">Scan</span>
          </button>
          <button 
            onClick={() => setMode('manual')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border ${mode === 'manual' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}
          >
            <Type size={24} className="mb-1" />
            <span className="text-xs font-medium">Manual</span>
          </button>
          <button 
            onClick={() => {
              setMode('photo');
              fileInputRef.current?.click();
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border ${mode === 'photo' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}
          >
            <Camera size={24} className="mb-1" />
            <span className="text-xs font-medium">Photo AI</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            capture="environment"
            onChange={handlePhotoUpload}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p>{mode === 'photo' ? 'AI is analyzing your item...' : 'Looking up barcode...'}</p>
            </div>
          ) : mode === 'scan' ? (
             <div className="flex flex-col items-center justify-center h-64 text-center">
               <div className="w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 bg-gray-50">
                 <Barcode className="text-gray-400" size={48} />
               </div>
               <p className="text-sm text-gray-500 mb-4">Point camera at barcode</p>
               <button 
                onClick={simulateScan}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
              >
                Simulate Scan
              </button>
             </div>
          ) : (
            <form id="addItemForm" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. Milk"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                   <select 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value as Location)}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input 
                    type="date" 
                    value={expiryDate} 
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                   <div className="flex items-center border rounded-lg">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 text-gray-600 hover:bg-gray-100 border-r">-</button>
                    <input 
                      type="number" 
                      value={quantity} 
                      readOnly
                      className="w-full text-center outline-none" 
                    />
                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-3 py-2.5 text-gray-600 hover:bg-gray-100 border-l">+</button>
                   </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {mode === 'manual' && (
          <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex justify-end">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 font-medium mr-2"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="addItemForm"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 flex items-center"
            >
              <Check size={18} className="mr-2" />
              Save Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddItem;
