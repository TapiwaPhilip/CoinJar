
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
        
        // Fetch the created jars in a simple query 
        // This avoids recursive policy issues by not requesting nested relations
        const { data: createdJars, error: createdJarsError } = await supabase
          .from('recipient_coinjar')
          .select(`
            id, 
            name, 
            relationship, 
            email, 
            created_at,
            creator_id
          `);
        
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
          // Get contributions in a separate query to avoid recursion
          const jarsWithTotals = await Promise.all(createdJars.map(async (jar) => {
            try {
              // Fetch contributions separately
              const { data: contributions } = await supabase
                .from('coinjar_contributions')
                .select('amount')
                .eq('coinjar_id', jar.id);
                
              // Calculate total contributions
              const totalAmount = contributions 
                ? contributions.reduce((sum, contribution) => {
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
                coinjar_contributions: contributions || []
              } as CoinJar;
            } catch (err) {
              console.error(`Error processing jar ${jar.id}:`, err);
              return {
                ...jar,
                total_amount: 0,
                delivery_status: 'pending' as 'pending' | 'processing' | 'delivered',
                target_amount: 100,
                percent_complete: 0,
                coinjar_contributions: []
              } as CoinJar;
            }
          }));
          
          setMyJars(jarsWithTotals);
        }
        
        // Fetch invitations with a simple query
        try {
          const { data: invitations, error: invitationsError } = await supabase
            .from('coinjar_invitations')
            .select('id, coinjar_id')
            .eq('invited_user_id', userId)
            .eq('accepted', false);
            
          if (invitationsError) {
            console.error('Error fetching invitations:', invitationsError);
            setInvitedJars([]);
          } else if (invitations && invitations.length > 0) {
            // Then get the jar details separately for each invitation
            const processedInvitations = await Promise.all(invitations.map(async (invitation) => {
              try {
                const { data: jarData } = await supabase
                  .from('recipient_coinjar')
                  .select('id, name, relationship, created_at, creator_id')
                  .eq('id', invitation.coinjar_id)
                  .maybeSingle();
                  
                return {
                  id: invitation.id,
                  name: jarData?.name || 'Unknown CoinJar',
                  relationship: jarData?.relationship || 'Unknown',
                  total_amount: 0, // Default values for invited jars
                  target_amount: 100,
                  percent_complete: 0,
                  delivery_status: 'pending',
                  created_at: jarData?.created_at || new Date().toISOString(),
                  coinjar_contributions: [],
                  creator_id: jarData?.creator_id
                } as InvitedJar;
              } catch (err) {
                console.error(`Error processing invitation ${invitation.id}:`, err);
                return null;
              }
            }));
            
            // Filter out null values (failed fetches)
            setInvitedJars(processedInvitations.filter(Boolean) as InvitedJar[]);
          } else {
            setInvitedJars([]);
          }
        } catch (error) {
          console.error('Error processing invitations:', error);
          setInvitedJars([]);
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
