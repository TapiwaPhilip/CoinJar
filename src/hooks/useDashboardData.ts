
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CoinJar, InvitedJar, Notification } from "@/types/dashboard";

export const useDashboardData = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [myJars, setMyJars] = useState<CoinJar[]>([]);
  const [invitedJars, setInvitedJars] = useState<InvitedJar[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    
    async function fetchData() {
      try {
        setLoading(true);
        
        console.log("Fetching CoinJars for user ID:", userId);
        
        // Fetch CoinJars created by the user with basic error handling
        const { data: createdJars, error: createdJarsError } = await supabase
          .from('recipient_coinjar')
          .select(`
            id, 
            name, 
            relationship, 
            email, 
            created_at,
            creator_id,
            coinjar_contributions(amount)
          `)
          .eq('creator_id', userId);
        
        if (createdJarsError) {
          console.error("Error fetching jars:", createdJarsError);
          toast({
            title: "Failed to load coin jars",
            description: createdJarsError.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        console.log("Retrieved jars:", createdJars);
        
        if (!createdJars || createdJars.length === 0) {
          console.log("No jars found, setting empty array");
          setMyJars([]);
        } else {
          // Calculate total contributions for each jar
          const jarsWithTotals = createdJars.map(jar => {
            // Convert amount to number before summing them
            const totalAmount = jar.coinjar_contributions
              ? jar.coinjar_contributions.reduce((sum, contribution) => {
                  const amount = typeof contribution.amount === 'string' 
                    ? parseFloat(contribution.amount) 
                    : contribution.amount;
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0)
              : 0;
            
            // Random delivery status for demo purposes - replace with real status in production
            const deliveryStatuses = ['pending', 'processing', 'delivered'];
            const randomStatus = deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)];
            
            // Fix the type error by ensuring target_amount and percent_complete are numbers
            const targetAmount = 100; // Example target, replace with real target from DB
            const percentComplete = Math.min(100, Math.round((totalAmount / targetAmount) * 100));
            
            return {
              ...jar,
              total_amount: totalAmount,
              delivery_status: randomStatus as 'pending' | 'processing' | 'delivered',
              target_amount: targetAmount,
              percent_complete: percentComplete,
              // Convert contribution amounts to numbers if they are strings
              coinjar_contributions: jar.coinjar_contributions 
                ? jar.coinjar_contributions.map(contribution => ({
                    amount: typeof contribution.amount === 'string' 
                      ? parseFloat(contribution.amount) 
                      : contribution.amount
                  }))
                : []
            } as CoinJar;
          });
          
          setMyJars(jarsWithTotals);
        }
        
        // Fetch real invitations with proper error handling
        const { data: invitations, error: invitationsError } = await supabase
          .from('coinjar_invitations')
          .select(`
            id,
            coinjar_id,
            recipient_coinjar(id, name, relationship, created_at, creator_id)
          `)
          .eq('invited_user_id', userId)
          .eq('accepted', false);
        
        if (invitationsError) {
          console.error('Error fetching invitations:', invitationsError);
          // Continue execution rather than throwing, to avoid blocking dashboard load
        } else {
          // Process invitations if we successfully fetched them
          const processedInvitations = invitations?.map(invitation => {
            return {
              id: invitation.id,
              name: invitation.recipient_coinjar?.name || 'Unknown CoinJar',
              relationship: invitation.recipient_coinjar?.relationship || 'Unknown',
              total_amount: 0, // Default values for invited jars
              target_amount: 100,
              percent_complete: 0,
              delivery_status: 'pending',
              created_at: invitation.recipient_coinjar?.created_at || new Date().toISOString(),
              coinjar_contributions: [],
              creator_id: invitation.recipient_coinjar?.creator_id
            } as InvitedJar;
          }) || [];
          
          setInvitedJars(processedInvitations);
        }
        
        // Mock notifications - replace with real notifications in production
        setNotifications([
          { 
            id: 1, 
            type: 'contribution', 
            message: 'Someone contributed $25 to Grandma\'s Birthday', 
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
        ]);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Failed to load dashboard",
          description: "There was an error loading your dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [userId, toast]);

  return {
    loading,
    myJars,
    invitedJars,
    notifications
  };
};
