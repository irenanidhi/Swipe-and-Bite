import { FoodItem } from './types';

// Helper function to calculate cosine similarity between two vectors
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) return 0;
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (norm1 * norm2);
}

// Helper function to create feature vector for a food item
function createFeatureVector(item: FoodItem): number[] {
  // Create a dictionary of all possible values for categorical features
  const dietMap = { 'vegetarian': 1, 'non vegetarian': 0 };
  const courseMap = {
    'main course': 1, 'dessert': 2, 'starter': 3, 'beverage': 4,
    'snack': 5, 'breakfast': 6, 'lunch': 7, 'dinner': 8
  };
  const flavorMap = {
    'sweet': 1, 'spicy': 2, 'bitter': 3, 'sour': 4,
    'umami': 5, 'salty': 6, 'neutral': 7
  };

  // Convert categorical features to numerical values
  const dietValue = dietMap[item.diet] || 0;
  const courseValue = courseMap[item.course.toLowerCase()] || 0;
  const flavorValue = flavorMap[item.flavor_profile.toLowerCase()] || 0;

  // Normalize numerical features
  const prepTime = item.prep_time / 60; // Normalize to hours
  const cookTime = item.cook_time / 60; // Normalize to hours

  // Count unique ingredients
  const ingredientCount = item.ingredients.length;

  // Combine all features into a single vector
  return [
    dietValue,
    courseValue,
    flavorValue,
    prepTime,
    cookTime,
    ingredientCount
  ];
}

// Function to find similar food items
export function findSimilarItems(
  targetItem: FoodItem,
  allItems: FoodItem[],
  numRecommendations: number = 5
): FoodItem[] {
  // Create feature vector for target item
  const targetVector = createFeatureVector(targetItem);
  
  // Calculate similarity scores for all items
  const itemsWithScores = allItems
    .filter(item => item.name !== targetItem.name) // Exclude the target item
    .map(item => ({
      item,
      score: cosineSimilarity(targetVector, createFeatureVector(item))
    }))
    .sort((a, b) => b.score - a.score); // Sort by similarity score

  // Return top N recommendations
  return itemsWithScores
    .slice(0, numRecommendations)
    .map(({ item }) => item);
}

// Function to get recommendations based on saved items
export function getRecommendations(
  savedItems: FoodItem[],
  allItems: FoodItem[],
  numRecommendations: number = 5
): FoodItem[] {
  if (savedItems.length === 0) return [];

  // Get recommendations for each saved item
  const allRecommendations = savedItems.flatMap(savedItem =>
    findSimilarItems(savedItem, allItems, numRecommendations)
  );

  // Remove duplicates and sort by frequency
  const recommendationCounts = new Map<string, { item: FoodItem; count: number }>();
  
  allRecommendations.forEach(item => {
    const key = `${item.name}-${item.restaurant}`;
    const existing = recommendationCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      recommendationCounts.set(key, { item, count: 1 });
    }
  });

  // Sort by frequency and return top recommendations
  return Array.from(recommendationCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, numRecommendations)
    .map(({ item }) => item);
} 