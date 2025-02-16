
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement actual auth logic
    
    toast({
      title: isLogin ? "Welcome back!" : "Account created successfully!",
      description: "You are now logged in.",
    });
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-6 animate-fadeIn">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Sign up to start your journey"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              className="input-focus"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              className="input-focus"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-squid-pink hover:bg-squid-pink/90 button-hover"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-squid-pink transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
};
