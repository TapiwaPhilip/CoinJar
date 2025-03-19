
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const RecipientProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a CoinJar",
        variant: "destructive",
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
      
      const { error } = await supabase
        .from('recipient_coinjar')
        .insert({
          creator_id: user.id,
          name: formData.name,
          relationship: formData.relationship,
          email: formData.email || null,
        });
      
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

  return <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-md">
        <Card className="p-6 glass-card">
          <h2 className="text-2xl font-semibold mb-6">Create Recipient CoinJar</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Recipient Name</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} placeholder="e.g., Grandma Didi" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input id="relationship" value={formData.relationship} onChange={e => setFormData({
              ...formData,
              relationship: e.target.value
            })} placeholder="e.g., Grandmother" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} placeholder="recipient@example.com" />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create CoinJar"}
            </Button>
          </form>
        </Card>
      </div>
    </div>;
};

export default RecipientProfile;
