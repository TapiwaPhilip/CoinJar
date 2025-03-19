
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onSwitchTab: () => void;
}

const SignInForm = ({
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  onSubmit,
  onSwitchTab,
}: SignInFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
      <div className="text-center mt-2">
        <button 
          type="button" 
          className="text-sm text-primary hover:underline" 
          onClick={onSwitchTab}
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
