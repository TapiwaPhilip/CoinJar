
import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

export type RecipientFormData = {
  name: string;
  relationship: string;
  email: string;
};

const FORM_STORAGE_KEY = "coinjar_recipient_form_data";

export function useRecipientForm() {
  const [formData, setFormData] = useState<RecipientFormData>({
    name: "",
    relationship: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (field: keyof RecipientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
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

  return {
    formData,
    isSubmitting,
    isLoading,
    user,
    handleInputChange,
    handleSubmit
  };
}
