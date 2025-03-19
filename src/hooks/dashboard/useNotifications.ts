
import { useState, useEffect } from "react";
import { Notification } from "@/types/dashboard";

export const useNotifications = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;
    
    function fetchNotifications() {
      try {
        // Create dummy notification data
        // In a real application, you would fetch this from the API
        const dummyNotifications: Notification[] = [
          { 
            id: 1, 
            type: 'contribution', 
            message: 'Someone contributed $25 to Birthday Gift for Mom', 
            created_at: new Date().toISOString(),
            read: false
          },
          { 
            id: 2, 
            type: 'invitation', 
            message: 'You\'ve been invited to contribute to Office Party', 
            created_at: new Date(Date.now() - 86400000).toISOString(),
            read: true
          }
        ];
        
        setNotifications(dummyNotifications);
      } catch (error: any) {
        console.error('Error in useNotifications:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNotifications();
  }, [userId]);

  return {
    loading,
    notifications
  };
};
