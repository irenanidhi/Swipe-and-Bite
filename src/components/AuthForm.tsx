import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { AtSign, Lock, User, ChefHat } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export function AuthForm() {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  
  // Form errors
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    const success = await login(loginEmail, loginPassword);
    setIsLoading(false);
    
    if (!success) {
      setLoginError('Invalid email or password');
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    if (!signupUsername || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError('Please fill in all fields');
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    const success = await signup(signupUsername, signupEmail, signupPassword);
    setIsLoading(false);
    
    if (!success) {
      setSignupError('Failed to create account. Email may already be in use.');
    }
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Food Animation Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Animated Food Items */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Biryani Animation */}
          <div className="absolute animate-float-diagonal-1">
            <img src="/food-icons/biryani.png" alt="" className="w-16 h-16 opacity-35" />
          </div>
          {/* Burger Animation */}
          <div className="absolute animate-float-diagonal-2">
            <img src="/food-icons/burger.png" alt="" className="w-16 h-16 opacity-35" />
          </div>
          {/* Sandwich Animation */}
          <div className="absolute animate-float-diagonal-3">
            <img src="/food-icons/sandwhich.png" alt="" className="w-16 h-16 opacity-35" />
          </div>
          {/* Espresso Animation */}
          <div className="absolute animate-float-diagonal-4">
            <img src="/food-icons/espresso.png" alt="" className="w-16 h-16 opacity-35" />
          </div>
          {/* Sushi Animation */}
          <div className="absolute animate-float-diagonal-1" style={{ animationDelay: '2s' }}>
            <img src="/food-icons/sushi.png" alt="" className="w-16 h-16 opacity-35" />
          </div>
          {/* Coffee Animation */}
          <div className="absolute animate-float-diagonal-2" style={{ animationDelay: '3s' }}>
            <img src="/food-icons/coffee.png" alt="" className="w-16 h-16 opacity-35" />
          </div>
        </div>

        {/* Animated Blobs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#752323]/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#8A2A2A]/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#B81111]/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#752323_1px,transparent_0)] bg-[size:40px_40px] opacity-5"></div>
      </div>

      <Card className="w-[380px] backdrop-blur-md bg-white/95 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
        {/* Card Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#752323]/5 to-transparent animate-shimmer"></div>

        <CardHeader className="space-y-1 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChefHat className="h-8 w-8 text-[#752323]" />
            <CardTitle className="text-2xl font-bold text-[#311336]">
              Swipe N' Bite
            </CardTitle>
          </div>
          <CardDescription className="text-[#5E3838]">
            Enter your details below to create your account or log in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-[#752323] data-[state=active]:text-white transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-[#752323] data-[state=active]:text-white transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-[#5E3838]">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-[#5E3838]/60" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="m@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-[#752323] focus:border-[#752323]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-[#5E3838]">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-[#5E3838]/60" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-[#752323] focus:border-[#752323]"
                      />
                    </div>
                  </div>
                  {loginError && (
                    <div className="p-3 rounded-lg bg-[#B81111]/10 border border-[#B81111] text-[#B81111] text-sm animate-shake">
                      <p className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B81111]"></span>
                        {loginError}
                      </p>
                    </div>
                  )}
                  <Button 
                    type="submit"
                    className="w-full bg-[#752323] hover:bg-[#8A2A2A] text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Logging in...
                      </div>
                    ) : (
                      <span>Login</span>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-[#5E3838]">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#5E3838]/60" />
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="johndoe"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-[#752323] focus:border-[#752323]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-[#5E3838]">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-[#5E3838]/60" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="m@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-[#752323] focus:border-[#752323]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-[#5E3838]">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-[#5E3838]/60" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-[#752323] focus:border-[#752323]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-[#5E3838]">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-[#5E3838]/60" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-[#752323] focus:border-[#752323]"
                      />
                    </div>
                  </div>
                  {signupError && (
                    <div className="p-3 rounded-lg bg-[#B81111]/10 border border-[#B81111] text-[#B81111] text-sm animate-shake">
                      <p className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B81111]"></span>
                        {signupError}
                      </p>
                    </div>
                  )}
                  <Button 
                    type="submit"
                    className="w-full bg-[#752323] hover:bg-[#8A2A2A] text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      <span>Sign Up</span>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
