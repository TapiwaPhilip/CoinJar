
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
        
        console.log("Fetching data for user ID:", userId);
        
        // STEP 1: Fetch basic CoinJar data with a simple query
        const { data: myJarsBasic, error: myJarsError } = await supabase
          .from('recipient_coinjar')
          .select('id, name, relationship, email, created_at, creator_id')
          .eq('creator_id', userId);
        
        if (myJarsError) {
          console.error("Error fetching CoinJars:", myJarsError);
          toast({
            title: "Failed to load coin jars",
            description: myJarsError.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        console.log("Retrieved basic jars data:", myJarsBasic);
        
        // STEP 2: If we have jars, fetch their contributions separately
        if (myJarsBasic && myJarsBasic.length > 0) {
          const enhancedJars = await Promise.all(myJarsBasic.map(async (jar) => {
            // Fetch contributions for this specific jar
            const { data: contributions, error: contribError } = await supabase
              .from('coinjar_contributions')
              .select('amount')
              .eq('coinjar_id', jar.id);
              
            if (contribError) {
              console.error(`Error fetching contributions for jar ${jar.id}:`, contribError);
            }
            
            // Calculate total and percentage
            const totalAmount = contributions 
              ? contributions.reduce((sum, contribution) => {
                  const amount = typeof contribution.amount === 'string' 
                    ? parseFloat(contribution.amount) 
                    : contribution.amount;
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0)
              : 0;
            
            // Mock data for demo purposes - replace with real data in production
            const targetAmount = 100;
            const percentComplete = Math.min(100, Math.round((totalAmount / targetAmount) * 100));
            const deliveryStatuses = ['pending', 'processing', 'delivered'];
            const randomStatus = deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)];
            
            return {
              ...jar,
              total_amount: totalAmount,
              target_amount: targetAmount,
              percent_complete: percentComplete,
              delivery_status: randomStatus as 'pending' | 'processing' | 'delivered',
              coinjar_contributions: contributions || []
            } as CoinJar;
          }));
          
          setMyJars(enhancedJars);
        } else {
          setMyJars([]);
        }
        
        // STEP 3: Fetch invitations with a direct query
        const { data: invitations, error: invitationsError } = await supabase
          .from('coinjar_invitations')
          .select('id, coinjar_id')
          .eq('invited_user_id', userId)
          .eq('accepted', false);
          
        if (invitationsError) {
          console.error('Error fetching invitations:', invitationsError);
          setInvitedJars([]);
        } else if (invitations && invitations.length > 0) {
          // For each invitation, fetch the jar details directly
          const processedInvitations = await Promise.all(invitations.map(async (invitation) => {
            try {
              // Simple direct query for each jar
              const { data: jarData, error: jarError } = await supabase
                .from('recipient_coinjar')
                .select('id, name, relationship, created_at, creator_id')
                .eq('id', invitation.coinjar_id)
                .maybeSingle();
                
              if (jarError) {
                console.error(`Error fetching jar data for invitation ${invitation.id}:`, jarError);
                return null;
              }
              
              if (!jarData) {
                console.warn(`No jar found for invitation ${invitation.id}`);
                return null;
              }
                
              return {
                id: invitation.id,
                name: jarData.name || 'Unknown CoinJar',
                relationship: jarData.relationship || 'Unknown',
                total_amount: 0, // Default values for invited jars
                target_amount: 100,
                percent_complete: 0,
                delivery_status: 'pending',
                created_at: jarData.created_at || new Date().toISOString(),
                coinjar_contributions: [],
                creator_id: jarData.creator_id
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
        
        // STEP 4: Set mock notifications (replace with real data in production)
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
