import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { FoodItem } from '../utils/types';
import { useToast } from '@/components/ui/use-toast';
import { loadFoodData } from '../utils/dataLoader';
import { getRecommendations } from '../utils/recommendations';

interface RestaurantsContextType {
  foodItems: FoodItem[];
  currentFoodItem: FoodItem | null;
  savedFoodItems: FoodItem[];
  savedRestaurants: FoodItem[];
  recommendedItems: FoodItem[];
  isLoading: boolean;
  error: string | null;
  selectedState: string | null;
  setSelectedState: (state: string | null) => void;
  fetchFoodItems: () => Promise<void>;
  getNextFoodItem: () => void;
  saveFoodItem: (item: FoodItem) => void;
  skipFoodItem: () => void;
  removeFromSaved: (item: FoodItem) => void;
  refreshRecommendations: () => void;
}

const RestaurantsContext = createContext<RestaurantsContextType | undefined>(undefined);

export const RestaurantsProvider = ({ children }: { children: ReactNode }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [currentFoodItem, setCurrentFoodItem] = useState<FoodItem | null>(null);
  const [savedFoodItems, setSavedFoodItems] = useState<FoodItem[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unseen, setUnseen] = useState<FoodItem[]>([]);
  const [skippedItems, setSkippedItems] = useState<FoodItem[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('swipe-n-bite-saved');
    if (saved) {
      try {
        const parsedSaved = JSON.parse(saved);
        setSavedFoodItems(parsedSaved);
      } catch (err) {
        console.error('Error parsing saved items:', err);
        localStorage.removeItem('swipe-n-bite-saved');
      }
    }
    
    fetchFoodItems();
  }, []);

  // Update recommendations when saved items change
  useEffect(() => {
    refreshRecommendations();
  }, [savedFoodItems, foodItems]);

  const refreshRecommendations = useCallback(() => {
    if (savedFoodItems.length === 0) {
      setRecommendedItems([]);
      return;
    }
    
    if (savedFoodItems.length > 0 && foodItems.length > 0) {
      const recommendations = getRecommendations(savedFoodItems, foodItems, 5);
      setRecommendedItems(recommendations);
    }
  }, [savedFoodItems, foodItems]);

  const fetchFoodItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await loadFoodData();
      setFoodItems(data);
      
      // First filter by state if selected
      let stateFiltered = data;
      if (selectedState) {
        stateFiltered = data.filter(item => item.state === selectedState);
        console.log('Filtered by state:', selectedState, stateFiltered.length);
      }
      
      // Then filter out saved items
      const savedNames = new Set(savedFoodItems.map(item => item.name));
      const filtered = stateFiltered.filter(item => !savedNames.has(item.name));
      
      // Shuffle the filtered items
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      
      console.log('Final filtered items:', shuffled.length);
      setUnseen(shuffled);
      setSkippedItems([]); // Reset skipped items when fetching new data
      
      if (shuffled.length > 0) {
        setCurrentFoodItem(shuffled[0]);
      } else {
        setCurrentFoodItem(null);
      }
      
    } catch (err) {
      setError('Failed to fetch food items. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to fetch food items",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [savedFoodItems, selectedState, toast]);

  const getNextFoodItem = () => {
    if (unseen.length <= 1) {
      // If we're running out of unseen items, add skipped items back to the queue
      if (skippedItems.length > 0) {
        // Shuffle the skipped items before adding them back
        const shuffledSkipped = [...skippedItems].sort(() => Math.random() - 0.5);
        const newUnseen = [...unseen, ...shuffledSkipped];
        setUnseen(newUnseen);
        setSkippedItems([]);
        setCurrentFoodItem(newUnseen[0]);
      } else {
        setCurrentFoodItem(null);
      }
      return;
    }
    
    const nextItems = unseen.slice(1);
    setUnseen(nextItems);
    setCurrentFoodItem(nextItems[0]);
  };

  const skipFoodItem = () => {
    if (currentFoodItem) {
      // Add the current item to skipped items
      setSkippedItems(prev => [...prev, currentFoodItem]);
      getNextFoodItem();
    }
  };

  const saveFoodItem = (item: FoodItem) => {
    const newSaved = [...savedFoodItems, item];
    setSavedFoodItems(newSaved);
    localStorage.setItem('swipe-n-bite-saved', JSON.stringify(newSaved));
    
    // Remove the saved item from recommendations if it exists there
    setRecommendedItems(prev => 
      prev.filter(rec => 
        rec.name !== item.name || rec.restaurant !== item.restaurant
      )
    );
    
    // Generate new recommendations
    const newRecommendations = getRecommendations(newSaved, foodItems, 5);
    setRecommendedItems(prev => {
      // Filter out any items that are already saved
      const filteredNewRecs = newRecommendations.filter(newRec => 
        !newSaved.some(saved => 
          saved.name === newRec.name && saved.restaurant === newRec.restaurant
        )
      );
      // Combine with existing recommendations that aren't saved
      const existingRecs = prev.filter(existing => 
        !newSaved.some(saved => 
          saved.name === existing.name && saved.restaurant === existing.restaurant
        )
      );
      // Return unique items
      const uniqueRecs = [...new Set([...filteredNewRecs, ...existingRecs])];
      return uniqueRecs.slice(0, 5); // Keep only top 5 recommendations
    });

    // Remove the saved item from skipped items if it's there
    setSkippedItems(prev => 
      prev.filter(skipped => 
        skipped.name !== item.name || skipped.restaurant !== item.restaurant
      )
    );
    
    toast({
      title: "Food item saved",
      description: `${item.name} added to your Eat-List`,
      duration: 3000,
    });
    
    getNextFoodItem();
  };

  const removeFromSaved = (item: FoodItem) => {
    const newSaved = savedFoodItems.filter(savedItem => 
      savedItem.name !== item.name || savedItem.restaurant !== item.restaurant
    );
    setSavedFoodItems(newSaved);
    localStorage.setItem('swipe-n-bite-saved', JSON.stringify(newSaved));
    
    // Add the item back to unseen if it's not already there and matches the selected state
    if (!unseen.some(unseenItem => 
      unseenItem.name === item.name && unseenItem.restaurant === item.restaurant
    )) {
      if (!selectedState || item.state === selectedState) {
        setUnseen([...unseen, item]);
      }
    }
    
    toast({
      title: "Food item removed",
      description: "Food item removed from your Eat-List",
      duration: 3000,
    });
  };

  return (
    <RestaurantsContext.Provider
      value={{
        foodItems,
        currentFoodItem,
        savedFoodItems,
        savedRestaurants: savedFoodItems,
        recommendedItems,
        isLoading,
        error,
        selectedState,
        setSelectedState,
        fetchFoodItems,
        getNextFoodItem,
        saveFoodItem,
        skipFoodItem,
        removeFromSaved,
        refreshRecommendations,
      }}
    >
      {children}
    </RestaurantsContext.Provider>
  );
};

export const useRestaurants = () => {
  const context = useContext(RestaurantsContext);
  if (context === undefined) {
    throw new Error('useRestaurants must be used within a RestaurantsProvider');
  }
  return context;
};
