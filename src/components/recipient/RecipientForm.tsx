
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type RecipientFormData = {
  name: string;
  relationship: string;
  email: string;
};

interface RecipientFormProps {
  formData: RecipientFormData;
  onChange: (field: keyof RecipientFormData, value: string) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
  isEditMode?: boolean;
  error?: string | null;
}

const RecipientForm = ({ 
  formData, 
  onChange, 
  onSubmit, 
  isSubmitting,
  isEditMode = false,
  error
}: RecipientFormProps) => {
  return (
    <Card className="p-6 glass-card">
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-2xl font-semibold">
          {isEditMode ? "Edit CoinJar" : "Create Recipient CoinJar"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Recipient Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => onChange("name", e.target.value)} 
              placeholder="e.g., Grandma Didi" 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input 
              id="relationship" 
              value={formData.relationship} 
              onChange={e => onChange("relationship", e.target.value)} 
              placeholder="e.g., Grandmother" 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email} 
              onChange={e => onChange("email", e.target.value)} 
              placeholder="recipient@example.com" 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEditMode ? "Updating..." : "Creating...") 
              : (isEditMode ? "Update CoinJar" : "Create CoinJar")}
          </Button>
          {!isEditMode && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Once created, you'll be able to invite others to view or contribute to this CoinJar.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default RecipientForm;
