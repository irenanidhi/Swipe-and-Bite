import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search } from 'lucide-react';

const indianStates = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Jammu & Kashmir",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "NCT of Delhi",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

interface LocationSelectProps {
  onLocationSelect: (state: string) => void;
}

export function LocationSelect({ onLocationSelect }: LocationSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredStates = indianStates.filter(state =>
    state.toLowerCase().trim() === searchQuery.toLowerCase().trim() ||
    state.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
  );

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    onLocationSelect(state.trim());
    navigate('/home');
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between bg-background overflow-hidden">
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

      {/* Header */}
      <div className="relative z-10 w-full text-center pt-8">
        <h1 className="text-[#311336] text-3xl font-bold">Swipe N' Bite</h1>
        <p className="text-[#5E3838] mt-2">Discover authentic cuisine from different states of India</p>
      </div>

      {/* Main Content */}
      <Card className="relative z-10 w-full max-w-md mx-4 backdrop-blur-md bg-white/95 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)]">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Navigation className="h-12 w-12 text-[#752323] animate-pulse" />
          </div>
          <CardTitle className="text-2xl text-center text-[#311336]">Select Your State</CardTitle>
          <CardDescription className="text-center text-[#5E3838]">
            Choose a state to discover its unique culinary delights
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5E3838]/60 transition-colors duration-200 group-focus-within:text-[#752323]" />
            <Input
              placeholder="Search for a state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 border-[#5E3838]/20 focus:border-[#752323] focus:ring-[#752323] transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredStates.map((state) => (
              <Button
                key={state}
                variant={selectedState === state ? "default" : "outline"}
                className={`justify-start transition-all duration-300 ${
                  selectedState === state 
                    ? 'bg-[#752323] hover:bg-[#8A2A2A] text-white' 
                    : 'hover:bg-[#752323]/10 hover:border-[#752323] hover:text-[#752323] text-[#5E3838]'
                }`}
                onClick={() => handleStateSelect(state)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {state}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="relative z-10 w-full text-center py-4 text-[#5E3838]/60 text-sm">
        © 2024 Swipe N' Bite. All rights reserved.
      </div>
    </div>
  );
} 