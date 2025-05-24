import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-background">
      {/* Framer iframe */}
      <iframe
        src="https://swipenbite.framer.website/"
        className="w-full h-full border-0"
        title="Swipe N Bite Landing Page"
      />
      
      {/* Overlay buttons */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate('/auth')}
          className="bg-[#752323] hover:bg-[#8A2A2A] text-white px-12 py-6 rounded-lg text-xl font-semibold shadow-lg transition-all duration-300"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
} 