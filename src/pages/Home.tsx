import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Navbar } from '@/components/Navbar';
import { FoodItemCard } from '@/components/FoodItemCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import { Skeleton } from '@/components/ui/skeleton';
import { Utensils } from 'lucide-react';
import { AIChatbot } from '@/components/AIChatbot';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentFoodItem, 
    isLoading, 
    fetchFoodItems,
    selectedState,
    setSelectedState,
    saveFoodItem, 
    skipFoodItem 
  } = useRestaurants();

  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      fetchFoodItems();
    }
  }, [isAuthenticated, navigate, fetchFoodItems]);

  // Refresh food items when selected state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchFoodItems();
    }
  }, [selectedState, isAuthenticated, fetchFoodItems]);

  const handleSwipeRight = () => {
    if (currentFoodItem) {
      saveFoodItem(currentFoodItem);
    }
  };

  const handleSwipeLeft = () => {
    skipFoodItem();
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = { role: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoadingAI(true);

    try {
      console.log('Sending message to server:', newMessage);
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatMessages, newMessage],
        }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to get response from AI');
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Chat error:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

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
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Utensils className="h-8 w-8 text-[#752323]" />
                <h1 className="text-3xl font-bold text-[#311336]">Discover Delicious Food</h1>
              </div>
              <p className="text-[#5E3838]">
                {selectedState ? `Showing food from ${selectedState}` : 'Swipe right to save restaurants you\'d like to try'}
              </p>
            </div>

            <div className="relative h-[600px]">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                  </motion.div>
                ) : currentFoodItem ? (
                  <motion.div
                    key={currentFoodItem.id}
                    initial={{ scale: 0.8, opacity: 0, x: 100 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.8, opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(event, info) => {
                      if (info.offset.x > 100) {
                        handleSwipeRight();
                      } else if (info.offset.x < -100) {
                        handleSwipeLeft();
                      }
                    }}
                    className="absolute w-full"
                  >
                    <FoodItemCard 
                      foodItem={currentFoodItem}
                      onLike={handleSwipeRight}
                      onSkip={handleSwipeLeft}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <p className="text-gray-600">
                      {selectedState 
                        ? `No more restaurants to show from ${selectedState}. Try a different state!` 
                        : 'No more restaurants to show. Check back later!'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="fixed bottom-8 right-8 z-50">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-[#752323] hover:bg-[#8A2A2A] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] rounded-full h-16 w-16"
                  >
                    <Bot className="h-8 w-8" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogTitle className="text-[#311336] flex items-center gap-2">
                    <Bot className="h-6 w-6 text-[#752323]" />
                    AI Food Assistant
                  </DialogTitle>
                  <DialogDescription>
                    Ask me anything about food, recipes, or restaurant recommendations!
                  </DialogDescription>
                  <div className="mt-4 h-[500px] overflow-y-auto rounded-lg border bg-background p-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-3 ${
                            message.role === 'user'
                              ? 'bg-[#752323] text-white'
                              : 'bg-[#5E3838]/10 text-[#5E3838]'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoadingAI && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl bg-gray-100 p-3">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-[#40A9FF]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-[#40A9FF]" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-[#40A9FF]" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 focus:ring-[#752323] focus:border-[#752323]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoadingAI}
                      className="bg-[#752323] hover:bg-[#8A2A2A]"
                    >
                      Send
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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

export default Home;
