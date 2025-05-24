import Papa from 'papaparse';
import { FoodItem } from './types';

export async function loadFoodData(): Promise<FoodItem[]> {
  try {
    const response = await fetch('/src/data/food_with_restaurants.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const foodItems = results.data.map((item: any) => ({
            name: item.name,
            ingredients: item.ingredients.split(',').map((ing: string) => ing.trim()),
            diet: item.diet,
            prep_time: parseInt(item.prep_time),
            cook_time: parseInt(item.cook_time),
            flavor_profile: item.flavor_profile,
            course: item.course,
            state: item.state,
            region: item.region,
            img_url: item.img_url,
            restaurant: item.restaurant,
            zomato_link: item.zomato_link || `https://www.zomato.com/search?q=${encodeURIComponent(item.restaurant)}`
          }));
          resolve(foodItems);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading food data:', error);
    throw error;
  }
} 