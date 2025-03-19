
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import AuthTabs from "@/components/auth/AuthTabs";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [error, setError] = useState("");
  const { signIn, signUp, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Always redirect to dashboard after successful authentication
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
      // Navigation handled in useEffect
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signUp(email, password, name);
      // Navigation handled in useEffect
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-8 text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          CoinJar
        </Link>
        
        <Card className="border border-primary/10 shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              isSubmitting={isSubmitting}
              error={error}
              handleSignIn={handleSignIn}
              handleSignUp={handleSignUp}
            />
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our 
              <Link to="/terms" className="underline text-primary ml-1 mr-1">Terms</Link>
              and
              <Link to="/privacy" className="underline text-primary ml-1">Privacy Policy</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
