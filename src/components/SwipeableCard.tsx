import { useState, useRef, TouchEvent, MouseEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Chat } from './Chat';
import { UserMatch, users, userPreferences } from '@/utils/mockData';

interface SwipeableCardProps {
  match: UserMatch;
  currentUserId: string;
  onAccept: (matchId: string) => void;
  onReject: (matchId: string) => void;
}

export function SwipeableCard({ match, currentUserId, onAccept, onReject }: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    handleSwipe();
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeDistance = currentX - startX;
    const threshold = 100; // Minimum distance for a swipe

    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0) {
        onAccept(match.id);
      } else {
        onReject(match.id);
      }
    }
    setCurrentX(0);
  };

  const getMatchedUser = (match: UserMatch) => {
    const matchedUserId = match.userId === currentUserId ? match.matchedUserId : match.userId;
    return users.find(user => user.id === matchedUserId);
  };

  const matchedUser = getMatchedUser(match);
  const matchedUserPrefs = userPreferences[matchedUser?.id || ''];

  const transform = isDragging ? `translateX(${currentX - startX}px)` : 'none';
  const rotate = isDragging ? `${(currentX - startX) * 0.1}deg` : '0deg';
  const opacity = isDragging ? 1 - Math.abs(currentX - startX) / 500 : 1;

  return (
    <Card
      ref={cardRef}
      className="overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing"
      style={{
        transform: `${transform} rotate(${rotate})`,
        opacity,
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{matchedUser?.username}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <span className="capitalize">{match.status}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {match.matchScore}% Match
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Common Interests</h4>
          <div className="flex flex-wrap gap-2">
            {match.commonInterests.map((interest, index) => (
              <Badge key={index} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Food Preferences</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cuisine</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {matchedUserPrefs?.cuisine.map((cuisine, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dietary Restrictions</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {matchedUserPrefs?.dietaryRestrictions.length > 0 ? (
                  matchedUserPrefs.dietaryRestrictions.map((diet, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {diet}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">None</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        {match.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onReject(match.id)}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => onAccept(match.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
          </div>
        )}
        
        {match.status === 'accepted' && (
          <div className="flex items-center gap-4 w-full">
            <p className="text-sm text-muted-foreground italic flex-1">
              "Link between two Strangers: FOOD!"
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <Chat
                  currentUserId={currentUserId}
                  matchedUserId={matchedUser?.id || ''}
                  matchedUsername={matchedUser?.username || ''}
                  onClose={() => {}}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 