import React, { useState } from 'react';
import { Camera, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Required fields",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please confirm your password correctly.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: isLogin ? "Login successful!" : "Account created!",
      description: isLogin 
        ? "Welcome back to Instagram Agent!" 
        : "Your account has been created successfully!"
    });

    setIsLoading(false);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl gradient-primary mb-4 shadow-large">
            <Camera className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Instagram Agent
          </h1>
          <p className="text-text-secondary">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-2xl shadow-large border border-border p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {isLogin ? 'Welcome back!' : 'Get started'}
            </h2>
            <p className="text-text-secondary">
              {isLogin 
                ? 'Sign in to continue creating amazing content'
                : 'Join the content creation revolution'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (only for signup) */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-text-primary">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="pl-10 h-12 border-border focus:border-input-focus transition-colors"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-text-primary">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="pl-10 h-12 border-border focus:border-input-focus transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-text-primary">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 border-border focus:border-input-focus transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field (only for signup) */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-primary">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="pl-10 h-12 border-border focus:border-input-focus transition-colors"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Forgot password (only for login) */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-secondary transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary h-12 text-base font-semibold mt-6"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                <div className="flex items-center">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </div>
              )}
            </Button>
          </form>

          {/* Toggle auth mode */}
          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-text-secondary">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-primary hover:text-secondary transition-colors font-semibold"
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;