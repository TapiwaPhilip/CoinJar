
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMyJars } from "./useMyJars";
import { useInvitedJars } from "./useInvitedJars";
import { useNotifications } from "./useNotifications";

export const useDashboardData = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const myJarsHook = useMyJars(userId);
  const invitedJarsHook = useInvitedJars(userId);
  const notificationsHook = useNotifications(userId);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    
    // Set loading state based on all data hooks
    if (!myJarsHook.loading && !invitedJarsHook.loading && !notificationsHook.loading) {
      setLoading(false);
    }
  }, [
    userId, 
    myJarsHook.loading, 
    invitedJarsHook.loading,
    notificationsHook.loading
  ]);

  return {
    loading,
    myJars: myJarsHook.myJars,
    invitedJars: invitedJarsHook.invitedJars,
    notifications: notificationsHook.notifications
  };
};
