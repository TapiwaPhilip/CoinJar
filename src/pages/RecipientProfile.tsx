
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const RecipientProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission in future implementation
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-md">
        <Card className="bordered-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-soft-blue/30 to-white border-b border-divider">
            <h2 className="text-2xl font-semibold">Create Recipient Profile</h2>
            <p className="text-sm text-muted-foreground">Set up a profile for the person receiving the funds</p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bordered-section pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Recipient Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Grandma Didi"
                    className="border border-divider focus:border-primary/50"
                  />
                </div>
              </div>
              
              <div className="bordered-section pb-4">
                <div className="space-y-2">
                  <Label htmlFor="relationship" className="text-sm font-medium">Relationship</Label>
                  <Input
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Grandmother"
                    className="border border-divider focus:border-primary/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="recipient@example.com"
                  className="border border-divider focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">We'll use this to send updates about contributions</p>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="border-t border-divider bg-soft-gray/30 p-6">
            <Button type="submit" className="w-full">
              Create Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RecipientProfile;
