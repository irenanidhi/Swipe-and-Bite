import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Heart, Clock, Utensils, MapPin, Trash2 } from 'lucide-react';
import { FoodItem } from '@/utils/types';
import { useState } from 'react';

interface FoodItemCardProps {
  foodItem: FoodItem;
  onSave?: () => void;
  onSkip?: () => void;
  showActions?: boolean;
  isSaved?: boolean;
}

export function FoodItemCard({ 
  foodItem, 
  onSave, 
  onSkip, 
  showActions = false,
  isSaved = false 
}: FoodItemCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(true);
    if (onSave) onSave();
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className="w-full max-w-md mx-auto backdrop-blur-md bg-white/95 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div className="relative h-64 overflow-hidden">
            <motion.img
              src={foodItem.img_url}
              alt={foodItem.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            {showActions && (
              <motion.div
                className="absolute top-4 right-4"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
                  onClick={isSaved ? onSave : handleLike}
                >
                  {isSaved ? (
                    <Trash2 className="h-6 w-6 text-red-500" />
                  ) : (
                    <motion.div
                      animate={isLiked ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-[#311336]">{foodItem.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-[#5E3838]">
                  {foodItem.restaurant}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-[#752323]/10 text-[#752323]">
                    {foodItem.diet}
                  </Badge>
                  <Badge variant="secondary" className="bg-[#752323]/10 text-[#752323]">
                    {foodItem.course}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#5E3838]">{foodItem.state}, {foodItem.region}</p>
                <p className="text-sm text-[#5E3838]">{foodItem.flavor_profile}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-[#5E3838]">
              <Clock className="h-4 w-4" />
              <span>Prep: {foodItem.prep_time} min | Cook: {foodItem.cook_time} min</span>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#5E3838] flex items-center gap-1">
                <Utensils className="h-4 w-4" />
                Ingredients
              </h4>
              <div className="flex flex-wrap gap-2">
                {foodItem.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="bg-[#752323]/10 text-[#752323] hover:bg-[#752323]/20">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </motion.div>

        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="border-[#752323]/20 text-[#752323] hover:bg-[#752323]/10 hover:text-[#752323]">
              <a href={foodItem.zomato_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <span>Zomato</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-[#752323]/20 text-[#752323] hover:bg-[#752323]/10 hover:text-[#752323]">
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(foodItem.restaurant)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <span>Directions</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
