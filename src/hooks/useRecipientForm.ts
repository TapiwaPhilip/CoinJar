
import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation, useParams } from "react-router-dom";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Load existing CoinJar data if in edit mode
  useEffect(() => {
    async function fetchCoinJarData() {
      if (!id || !user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('recipient_coinjar')
          .select('name, relationship, email')
          .eq('id', id)
          .eq('creator_id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching CoinJar:", error);
          toast({
            title: "Error",
            description: "Could not load the CoinJar details.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        if (data) {
          setFormData({
            name: data.name || "",
            relationship: data.relationship || "",
            email: data.email || ""
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Load from localStorage first for non-edit mode
    if (!isEditMode) {
      const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          setFormData(parsedData);
          localStorage.removeItem(FORM_STORAGE_KEY);
        } catch (error) {
          console.error("Error parsing saved form data:", error);
        }
      }
      setIsLoading(false);
    } else {
      fetchCoinJarData();
    }
  }, [id, user, navigate, toast, isEditMode]);

  useEffect(() => {
    if (!authLoading && !user) {
      if (formData.name || formData.relationship || formData.email) {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
        
        toast({
          title: "Authentication required",
          description: "Please sign in to create a CoinJar. Your information will be saved.",
        });
      }
      
      navigate("/auth", { 
        state: { returnTo: location.pathname }
      });
    }
  }, [user, authLoading, navigate, formData, location.pathname, toast]);

  const handleInputChange = (field: keyof RecipientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a CoinJar",
        variant: "destructive",
      });
      
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
      navigate("/auth", { 
        state: { returnTo: location.pathname }
      });
      return;
    }

    if (!formData.name || !formData.relationship) {
      setError("Please provide both a name and relationship");
      toast({
        title: "Missing information",
        description: "Please provide both a name and relationship",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      if (isEditMode && id) {
        // Update existing CoinJar
        console.log("Updating CoinJar with ID:", id);
        
        const { error: updateError } = await supabase
          .from('recipient_coinjar')
          .update({
            name: formData.name,
            relationship: formData.relationship,
            email: formData.email || null,
          })
          .eq('id', id)
          .eq('creator_id', user.id);
          
        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }
        
        toast({
          title: "CoinJar updated",
          description: `CoinJar for ${formData.name} has been updated successfully`,
        });
      } else {
        // Create new CoinJar
        console.log("Creating CoinJar with user ID:", user.id);
        
        const { data, error: insertError } = await supabase
          .from('recipient_coinjar')
          .insert({
            creator_id: user.id,
            name: formData.name,
            relationship: formData.relationship,
            email: formData.email || null,
          })
          .select('id')
          .single();
        
        if (insertError) {
          console.error("Insert error details:", insertError);
          
          console.log("Using create_coinjar function approach...");
          
          const { data: jarData, error: funcError } = await supabase
            .rpc('create_coinjar', { 
              p_name: formData.name,
              p_relationship: formData.relationship,
              p_email: formData.email || null
            });
            
          if (funcError) {
            console.error("Function creation error:", funcError);
            throw funcError;
          }
          
          console.log("Successfully created coinjar via RPC:", jarData);
        }
        
        toast({
          title: "CoinJar created",
          description: `CoinJar for ${formData.name} has been created successfully`,
        });
      }
      
      setFormData({
        name: "",
        relationship: "",
        email: "",
      });

      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Error creating/updating CoinJar:", error);
      setError(error.message || "An unknown error occurred");
      toast({
        title: isEditMode ? "Failed to update CoinJar" : "Failed to create CoinJar",
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
    isLoading: isLoading || authLoading,
    error,
    user,
    isEditMode,
    handleInputChange,
    handleSubmit
  };
}
