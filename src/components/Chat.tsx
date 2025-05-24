import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Smile, X } from 'lucide-react';
import { ChatMessage, chatMessages } from '@/utils/mockData';

interface ChatProps {
  currentUserId: string;
  matchedUserId: string;
  matchedUsername: string;
  onClose: () => void;
}

export function Chat({ currentUserId, matchedUserId, matchedUsername, onClose }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter messages between these two users
    const userMessages = chatMessages.filter(
      msg => 
        (msg.senderId === currentUserId && msg.receiverId === matchedUserId) ||
        (msg.senderId === matchedUserId && msg.receiverId === currentUserId)
    );
    setMessages(userMessages);
  }, [currentUserId, matchedUserId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: matchedUserId,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md backdrop-blur-md bg-white/90 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#752323]/10 flex items-center justify-center">
            <span className="text-sm font-medium text-[#752323]">
              {matchedUsername.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-[#752323]">{matchedUsername}</h3>
            <p className="text-xs text-[#5E3838]">Food Buddy</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-[#5E3838] hover:text-[#752323] hover:bg-[#752323]/10 transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.senderId === currentUserId
                    ? 'bg-[#752323] text-white'
                    : 'bg-[#5E3838]/10 text-[#5E3838]'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === currentUserId ? 'text-white/70' : 'text-[#5E3838]/70'
                }`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className="text-[#5E3838] hover:text-[#752323] hover:bg-[#752323]/10 transition-colors duration-200"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#5E3838]/5 border-[#5E3838]/20 focus:border-[#752323] focus:ring-[#752323] transition-all duration-200"
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className="text-[#5E3838] hover:text-[#752323] hover:bg-[#752323]/10 transition-colors duration-200"
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Button 
            type="submit" 
            size="icon"
            className="bg-[#752323] hover:bg-[#8A2A2A] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 