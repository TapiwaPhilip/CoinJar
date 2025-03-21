
import { useRecipientForm } from "@/hooks/useRecipientForm";
import RecipientForm from "@/components/recipient/RecipientForm";

const RecipientProfile = () => {
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

export default RecipientProfile;
