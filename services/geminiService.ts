import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

// Initialize Gemini
// NOTE: In a real app, ensure process.env.API_KEY is defined. 
// For this environment, we assume it is injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Analyzes an image to identify food items.
 */
export const analyzeImageForItem = async (base64Image: string): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Identify the food items in this image. Return a JSON array. 
            For each item, provide:
            - name (string)
            - category (one of: Dairy, Vegetables, Fruits, Meat & Fish, Pantry, Beverages, Frozen, Other)
            - estimatedExpiryDays (integer, typical shelf life in fridge)
            - quantity (number, default 1)
            - unit (string, e.g., 'pack', 'liter', 'lb')`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              estimatedExpiryDays: { type: Type.INTEGER },
              quantity: { type: Type.NUMBER },
              unit: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("Failed to analyze image.");
  }
};

/**
 * Generates recipes based on a list of ingredients.
 */
export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const prompt = `Suggest 3 recipes that use some of these ingredients: ${ingredients.join(', ')}.
    Prioritize recipes that use the most ingredients from the list.
    Return a JSON array of recipe objects.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Generate a unique random ID" },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of all ingredients needed"
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              cookingTime: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              usedIngredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Names of ingredients from the input list that are used"
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Gemini Recipe Error:", error);
    throw new Error("Failed to generate recipes.");
  }
};
