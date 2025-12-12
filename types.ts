export type Category = 'Dairy' | 'Vegetables' | 'Fruits' | 'Meat & Fish' | 'Pantry' | 'Beverages' | 'Frozen' | 'Other';
export type Location = 'Fridge' | 'Freezer' | 'Pantry' | 'Counter';
export type ExpiryStatus = 'fresh' | 'soon' | 'expired';

export interface Item {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  location: Location;
  purchaseDate: string;
  expiryDate: string;
  notes?: string;
}

export interface Task {
  id: string;
  name: string;
  frequencyDays: number;
  lastCompleted: string; // ISO Date
  nextDue: string; // ISO Date
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  usedIngredients: string[]; // IDs of items used
}

export interface MealPlan {
  date: string; // ISO Date YYYY-MM-DD
  type: 'Breakfast' | 'Lunch' | 'Dinner';
  recipe: Recipe;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.FC<any>;
}
