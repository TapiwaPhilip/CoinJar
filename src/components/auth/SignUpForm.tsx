
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface SignUpFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onSwitchTab: () => void;
}

const SignUpForm = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  onSubmit,
  onSwitchTab,
}: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-signup">Email</Label>
        <Input 
          id="email-signup" 
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-signup">Password</Label>
        <Input 
          id="password-signup" 
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
          minLength={6}
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
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
      <div className="text-center mt-2">
        <button 
          type="button" 
          className="text-sm text-primary hover:underline" 
          onClick={onSwitchTab}
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
