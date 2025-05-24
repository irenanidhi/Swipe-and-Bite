import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { MessageCircle, Image as ImageIcon, Hash, MessageSquare, Share2 } from 'lucide-react';

interface Tweet {
  id: string;
  username: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  hashtags: number;
}

const TweetAbout = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [tweet, setTweet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tweets, setTweets] = useState<Tweet[]>([
    {
      id: '1',
      username: 'MeetSaurabh',
      handle: 'meetsaurabh',
      content: 'I love the shami kebab at Hyderabad House! The meat is so tender and flavorful. Highly recommended!',
      timestamp: '2h',
      likes: 12,
      comments: 12,
      hashtags: 3
    },
    {
      id: '2',
      username: 'Irena',
      handle: 'erenoice',
      content: 'I love the osmania biscuits at Karachi Bakery! The biscuits are so crumbly and sweet-salty. Highly recommended!',
      timestamp: '5h',
      likes: 8,
      comments: 8,
      hashtags: 2
    }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweet.trim() || !user) return;

    setIsSubmitting(true);
    
    const newTweet: Tweet = {
      id: Date.now().toString(),
      username: user.username,
      handle: user.username.toLowerCase().replace(/\s+/g, ''),
      content: tweet,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      hashtags: (tweet.match(/#\w+/g) || []).length
    };

    setTweets(prevTweets => [newTweet, ...prevTweets]);
    setTweet('');
    setIsSubmitting(false);
  };

  const handleLike = (tweetId: string) => {
    setTweets(prevTweets =>
      prevTweets.map(tweet =>
        tweet.id === tweetId
          ? { ...tweet, likes: tweet.likes + 1 }
          : tweet
      )
    );
  };

  if (!user) return null;

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
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MessageSquare className="h-8 w-8 text-[#752323]" />
                <h1 className="text-3xl font-bold text-[#311336]">Share Your Food Journey</h1>
              </div>
              <p className="text-[#5E3838]">
                Tweet about your food experiences and connect with other food lovers
              </p>
            </div>

            <Card className="mb-8 backdrop-blur-md bg-white/95 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0">
              <CardHeader>
                <CardTitle className="text-[#311336]">Create a Tweet</CardTitle>
                <CardDescription className="text-[#5E3838]">
                  Share your thoughts about food, restaurants, or your latest food adventure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#752323]/10 flex items-center justify-center">
                      <span className="text-[#752323] font-semibold">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Textarea
                        placeholder="What's on your mind?"
                        value={tweet}
                        onChange={(e) => setTweet(e.target.value)}
                        className="min-h-[100px] resize-none bg-white/50 border-[#5E3838]/20 focus:border-[#752323] focus:ring-[#752323] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-[#5E3838]/60 hover:text-[#752323] hover:bg-[#752323]/10 transition-colors duration-200"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-[#5E3838]/60 hover:text-[#752323] hover:bg-[#752323]/10 transition-colors duration-200"
                      >
                        <Hash className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!tweet.trim() || isSubmitting}
                      className="bg-[#752323] hover:bg-[#8A2A2A] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Tweet'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#311336] flex items-center gap-2">
                <Share2 className="h-6 w-6 text-[#752323]" />
                Recent Tweets
              </h2>
              <div className="space-y-4">
                {tweets.map((tweet) => (
                  <Card key={tweet.id} className="backdrop-blur-md bg-white/95 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)]">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#752323]/10 flex items-center justify-center">
                          <span className="text-[#752323] font-semibold">
                            {tweet.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-[#311336]">{tweet.username}</span>
                            <span className="text-[#5E3838]/60 text-sm">@{tweet.handle}</span>
                            <span className="text-[#5E3838]/40 text-sm">· {tweet.timestamp}</span>
                          </div>
                          <p className="mb-4 text-[#5E3838]">{tweet.content}</p>
                          <div className="flex items-center gap-4 text-[#5E3838]/60">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2 hover:text-[#752323] hover:bg-[#752323]/10 transition-colors duration-200"
                              onClick={() => handleLike(tweet.id)}
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>{tweet.likes}</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2 hover:text-[#752323] hover:bg-[#752323]/10 transition-colors duration-200"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>{tweet.comments}</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2 hover:text-[#752323] hover:bg-[#752323]/10 transition-colors duration-200"
                            >
                              <Hash className="h-4 w-4" />
                              <span>{tweet.hashtags}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

export default TweetAbout;
