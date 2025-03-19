
import { useRecipientForm } from "@/hooks/useRecipientForm";
import RecipientForm from "@/components/recipient/RecipientForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EditRecipient = () => {
  const { 
    formData, 
    isSubmitting, 
    isLoading, 
    user, 
    error,
    isEditMode,
    handleInputChange, 
    handleSubmit 
  } = useRecipientForm();

  // If still loading auth state or not authenticated, show a loading state
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
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <RecipientForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          error={error}
        />
      </div>
    </div>
  );
};

export default EditRecipient;
