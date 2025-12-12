import React, { useState } from 'react';
import { ChefHat, RefreshCw, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Item, Recipe } from '../types';
import { generateRecipes } from '../services/geminiService';

interface MealPlannerProps {
  items: Item[];
  savedRecipes: Recipe[];
  onSaveRecipe: (recipe: Recipe) => void;
}

const MealPlanner: React.FC<MealPlannerProps> = ({ items, savedRecipes, onSaveRecipe }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'saved'>('suggestions');

  const handleGenerate = async () => {
    // Filter items expiring soon (within 7 days) to prioritize
    const expiringItems = items.filter(item => {
      const days = (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      return days <= 7 && days >= -1;
    }).map(i => i.name);

    // If few expiring items, just take random items from inventory
    const ingredients = expiringItems.length > 2 
      ? expiringItems 
      : items.slice(0, 8).map(i => i.name);

    if (ingredients.length === 0) {
      alert("Add some items to your inventory first!");
      return;
    }

    setLoading(true);
    try {
      const recipes = await generateRecipes(ingredients);
      setSuggestions(recipes);
    } catch (error) {
      alert("Failed to get suggestions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col pb-24">
       <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-lg mb-4">
         <h1 className="text-2xl font-bold mb-2 flex items-center">
           <ChefHat className="mr-2" /> Meal Planner
         </h1>
         <p className="text-indigo-100 text-sm mb-4">
           Reduce waste by cooking with what you have. 
           {items.length > 0 ? ` Found ${items.length} ingredients.` : ' No ingredients found.'}
         </p>
         
         <div className="flex bg-indigo-800/50 p-1 rounded-lg">
           <button 
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'suggestions' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-200 hover:text-white'}`}
           >
             AI Suggestions
           </button>
           <button 
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'saved' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-200 hover:text-white'}`}
           >
             Saved Plans
           </button>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto px-4">
         {activeTab === 'suggestions' && (
           <div className="space-y-4">
             {suggestions.length === 0 && !loading && (
               <div className="text-center py-8">
                 <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                   <BookOpen className="text-indigo-400" size={32} />
                 </div>
                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Inspiration?</h3>
                 <p className="text-gray-500 text-sm mb-6">Let AI analyze your fridge and suggest perfect recipes to use up expiring items.</p>
                 <button 
                   onClick={handleGenerate}
                   className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex items-center mx-auto"
                 >
                   <RefreshCw size={18} className="mr-2" />
                   Generate Recipes
                 </button>
               </div>
             )}

             {loading && (
               <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                     <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                     <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
                     <div className="h-20 bg-gray-50 rounded w-full"></div>
                   </div>
                 ))}
               </div>
             )}

             {suggestions.map((recipe, idx) => (
               <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
                 <div className="p-5">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">{recipe.name}</h3>
                     <span className={`text-xs px-2 py-1 rounded-full ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                       {recipe.difficulty}
                     </span>
                   </div>
                   <p className="text-gray-500 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                   
                   <div className="flex items-center text-xs text-gray-400 mb-4">
                     <Clock size={14} className="mr-1" /> {recipe.cookingTime}
                     <span className="mx-2">•</span>
                     <span>Uses {recipe.usedIngredients.length} items from pantry</span>
                   </div>

                   <div className="border-t pt-3 flex justify-between items-center">
                     <button className="text-indigo-600 text-sm font-semibold hover:underline">View Full Recipe</button>
                     <button 
                      onClick={() => {
                        onSaveRecipe(recipe);
                        alert("Recipe added to your Saved Plans!");
                      }}
                      className="bg-gray-100 p-2 rounded-full hover:bg-indigo-50 text-gray-500 hover:text-indigo-600"
                    >
                       <ArrowRight size={18} />
                     </button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         )}

         {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedRecipes.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No saved meal plans yet.</div>
              ) : (
                savedRecipes.map(recipe => (
                  <div key={recipe.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500">
                    <h3 className="font-bold text-gray-800">{recipe.name}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-semibold mb-1">Ingredients:</p>
                      <ul className="list-disc pl-4 text-xs space-y-1">
                        {recipe.ingredients.slice(0,4).map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                        {recipe.ingredients.length > 4 && <li>+ {recipe.ingredients.length - 4} more</li>}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
         )}
       </div>
    </div>
  );
};

export default MealPlanner;
