import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, users } from '@/utils/mockData';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  selectedCity: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  setSelectedCity: (city: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('swipe-n-bite-user');
    const savedCity = localStorage.getItem('swipe-n-bite-city');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user exists
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('swipe-n-bite-user', JSON.stringify(foundUser));
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.username}!`,
        duration: 3000,
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if email already exists
    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
      toast({
        title: "Signup failed",
        description: "Email already in use",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(), // Simple ID generation
      username,
      email,
      password,
      preferences: {
        cuisine: [],
        dietaryRestrictions: []
      }
    };
    
    // In a real app, this would be an API call
    users.push(newUser);
    
    setUser(newUser);
    localStorage.setItem('swipe-n-bite-user', JSON.stringify(newUser));
    
    toast({
      title: "Account created",
      description: `Welcome to Swipe-n-Bite, ${username}!`,
      duration: 3000,
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setSelectedCity(null);
    localStorage.removeItem('swipe-n-bite-user');
    localStorage.removeItem('swipe-n-bite-city');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      duration: 3000,
    });
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem('swipe-n-bite-city', city);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedCity,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        setSelectedCity: handleCitySelect
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
