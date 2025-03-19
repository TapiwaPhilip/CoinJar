import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const RecipientProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    email: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission in future implementation
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
            <Button type="submit" className="w-full">
              Create CoinJar
            </Button>
          </form>
        </Card>
      </div>
    </div>;
};

export default RecipientProfile;
