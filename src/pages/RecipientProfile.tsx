
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle } from "lucide-react";

const FORM_STORAGE_KEY = "coinjar_recipient_form_data";

const RecipientProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    email: ""
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Load saved form data from localStorage on initial render
  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        // Clear the saved data once retrieved
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  // Check authentication status after the auth state is loaded
  useEffect(() => {
    // Only redirect if auth state is loaded (not in loading state) and user is not authenticated
    if (!isLoading && !user) {
      // Save current form data to localStorage before redirecting
      if (formData.name || formData.relationship || formData.email) {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
        
        toast({
          title: "Authentication required",
          description: "Please sign in to create a CoinJar. Your information will be saved.",
        });
      }
      
      // Redirect to auth page with return URL
      navigate("/auth", { 
        state: { returnTo: location.pathname }
      });
    }
  }, [user, isLoading, navigate, formData, location.pathname, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a CoinJar",
        variant: "destructive",
      });
      
      // Save form data before redirect
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
      navigate("/auth", { 
        state: { returnTo: location.pathname }
      });
      return;
    }

    if (!formData.name || !formData.relationship) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and relationship",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Insert the CoinJar and get the generated ID
      const { data, error } = await supabase
        .from('recipient_coinjar')
        .insert({
          creator_id: user.id,
          name: formData.name,
          relationship: formData.relationship,
          email: formData.email || null,
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "CoinJar created",
        description: `CoinJar for ${formData.name} has been created successfully`,
      });
      
      // Reset form
      setFormData({
        name: "",
        relationship: "",
        email: "",
      });

      // Navigate to dashboard or another appropriate page
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Error creating CoinJar:", error);
      toast({
        title: "Failed to create CoinJar",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still loading auth state or not authenticated, show a loading state or nothing
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Only render the form if the user is authenticated
  if (!user) {
    return null; // This will prevent the form from flashing before redirect
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-md">
        <Card className="p-6 glass-card">
          <h2 className="text-2xl font-semibold mb-6">Create Recipient CoinJar</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Recipient Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} 
                placeholder="e.g., Grandma Didi" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input 
                id="relationship" 
                value={formData.relationship} 
                onChange={e => setFormData({
                  ...formData,
                  relationship: e.target.value
                })} 
                placeholder="e.g., Grandmother" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} 
                placeholder="recipient@example.com" 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create CoinJar"}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Once created, you'll be able to invite others to view or contribute to this CoinJar.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RecipientProfile;
