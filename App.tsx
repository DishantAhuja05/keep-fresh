import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import AddItem from './components/AddItem';
import MealPlanner from './components/MealPlanner';
import TaskTracker from './components/TaskTracker';
import { Item, Task, Recipe } from './types';

// Mock Initial Data
const INITIAL_ITEMS: Item[] = [
  { id: '1', name: 'Whole Milk', category: 'Dairy', quantity: 1, unit: 'gal', location: 'Fridge', purchaseDate: '2023-10-01', expiryDate: new Date(Date.now() + 86400000).toISOString() }, // Tomorrow
  { id: '2', name: 'Eggs', category: 'Dairy', quantity: 12, unit: 'pcs', location: 'Fridge', purchaseDate: '2023-10-01', expiryDate: new Date(Date.now() + 86400000 * 10).toISOString() },
  { id: '3', name: 'Bread', category: 'Pantry', quantity: 1, unit: 'loaf', location: 'Pantry', purchaseDate: '2023-10-01', expiryDate: new Date(Date.now() + 86400000 * 3).toISOString() },
  { id: '4', name: 'Spinach', category: 'Vegetables', quantity: 1, unit: 'bag', location: 'Fridge', purchaseDate: '2023-10-01', expiryDate: new Date(Date.now() - 86400000).toISOString() }, // Expired
];

const INITIAL_TASKS: Task[] = [
  { id: '1', name: 'Replace HVAC Filter', frequencyDays: 90, lastCompleted: '2023-08-01', nextDue: new Date(Date.now() + 86400000 * 5).toISOString() },
  { id: '2', name: 'Water Filter', frequencyDays: 60, lastCompleted: '2023-09-01', nextDue: new Date(Date.now() + 86400000 * 45).toISOString() },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddItem, setShowAddItem] = useState(false);
  
  // Data State
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  // Item Handlers
  const handleAddItem = (item: Item) => {
    setItems(prev => [item, ...prev]);
    setShowAddItem(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Task Handlers
  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const now = new Date();
      const next = new Date();
      next.setDate(now.getDate() + t.frequencyDays);
      return {
        ...t,
        lastCompleted: now.toISOString(),
        nextDue: next.toISOString()
      };
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard items={items} onNavigate={setActiveTab} recipes={savedRecipes} />;
      case 'items':
        return <Inventory items={items} onDelete={handleDeleteItem} />;
      case 'meals':
        return <MealPlanner items={items} savedRecipes={savedRecipes} onSaveRecipe={(r) => setSavedRecipes([...savedRecipes, r])} />;
      case 'tasks':
        return <TaskTracker tasks={tasks} onAddTask={handleAddTask} onCompleteTask={handleCompleteTask} />;
      default:
        return <Dashboard items={items} onNavigate={setActiveTab} recipes={savedRecipes} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onNavigate={setActiveTab} 
      onOpenAdd={() => setShowAddItem(true)}
    >
      {renderContent()}
      
      {showAddItem && (
        <AddItem 
          onClose={() => setShowAddItem(false)} 
          onAdd={handleAddItem}
        />
      )}
    </Layout>
  );
};

export default App;
