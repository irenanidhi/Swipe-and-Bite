import { useEffect, useState } from 'react';
import { useRestaurants } from '../hooks/useRestaurants';
import { FoodItemCard } from '@/components/FoodItemCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookmarkCheck } from 'lucide-react';

const EatList = () => {
  const { 
    savedFoodItems, 
    removeFromSaved, 
    recommendedItems,
    saveFoodItem 
  } = useRestaurants();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleRemove = (item: any) => {
    removeFromSaved(item);
    toast({
      title: "Food item removed",
      description: "Food item removed from your Eat-List",
      duration: 3000,
    });
  };

  const handleSaveRecommended = (item: any) => {
    saveFoodItem(item);
    toast({
      title: "Food item saved",
      description: `${item.name} added to your Eat-List`,
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#752323_1px,transparent_0)] bg-[size:40px_40px]"></div>
      </div>

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#752323]/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#8A2A2A]/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#B81111]/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-10 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookmarkCheck className="h-8 w-8 text-[#752323]" />
              <h1 className="text-3xl font-bold text-[#311336]">Your Eat-List</h1>
            </div>
            <p className="text-[#5E3838]">
              Your saved food items and personalized recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="col-span-1 backdrop-blur-md bg-white/95 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <CardHeader>
                <CardTitle className="text-[#311336]">Saved Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {savedFoodItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[#5E3838]">No saved items yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedFoodItems.map((item) => (
                        <FoodItemCard
                          key={`${item.name}-${item.restaurant}`}
                          foodItem={item}
                          onSave={() => handleRemove(item)}
                          showActions={true}
                          isSaved={true}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="col-span-1 backdrop-blur-md bg-white/95 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <CardHeader>
                <CardTitle className="text-[#311336]">Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {recommendedItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[#5E3838]">
                        {savedFoodItems.length === 0 
                          ? "Save some items to get recommendations" 
                          : "No recommendations available yet"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recommendedItems.map((item) => (
                        <FoodItemCard
                          key={`${item.name}-${item.restaurant}`}
                          foodItem={item}
                          onSave={() => handleSaveRecommended(item)}
                          showActions={true}
                          isSaved={false}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => navigate('/')}
              className="bg-[#752323] hover:bg-[#8A2A2A] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Back to Discovery
            </Button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto w-full text-center py-4 text-[#5E3838]/60 text-sm">
        © 2024 Swipe N' Bite. All rights reserved.
      </div>
    </div>
  );
};

export default EatList;
