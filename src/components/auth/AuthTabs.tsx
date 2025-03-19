
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  isSubmitting: boolean;
  error: string;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
}

const AuthTabs = ({
  activeTab,
  setActiveTab,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  isSubmitting,
  error,
  handleSignIn,
  handleSignUp,
}: AuthTabsProps) => {
  return (
    <Tabs 
      defaultValue="signin" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <SignInForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isSubmitting={isSubmitting}
          onSubmit={handleSignIn}
          onSwitchTab={() => setActiveTab("signup")}
        />
      </TabsContent>
      
      <TabsContent value="signup">
        <SignUpForm 
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isSubmitting={isSubmitting}
          onSubmit={handleSignUp}
          onSwitchTab={() => setActiveTab("signin")}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
