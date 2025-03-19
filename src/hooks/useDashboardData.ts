
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
        
        // STEP 1: Fetch CoinJars created by the current user
        // The RLS policy will automatically filter to show only the user's jars
        const { data: myJarsBasic, error: myJarsError } = await supabase
          .from('recipient_coinjar')
          .select('id, name, relationship, email, created_at, creator_id');
        
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
        
        let enhancedJars: CoinJar[] = [];

        // STEP 2: Process the jars and get their contributions
        if (myJarsBasic && myJarsBasic.length > 0) {
          // Get all jar IDs for a batch query
          const jarIds = myJarsBasic.map(jar => jar.id);
          
          // Fetch all contributions in a single batch query
          const { data: allContributions, error: batchContribError } = await supabase
            .from('coinjar_contributions')
            .select('coinjar_id, amount')
            .in('coinjar_id', jarIds);
            
          if (batchContribError) {
            console.error("Error fetching contributions batch:", batchContribError);
          }
          
          // Group contributions by jar ID
          const contributionsByJarId = (allContributions || []).reduce((acc, contrib) => {
            if (!acc[contrib.coinjar_id]) {
              acc[contrib.coinjar_id] = [];
            }
            acc[contrib.coinjar_id].push(contrib);
            return acc;
          }, {} as Record<string, any[]>);
          
          // Process each jar with its contributions
          enhancedJars = myJarsBasic.map(jar => {
            const jarContributions = contributionsByJarId[jar.id] || [];
            
            // Calculate total contributions
            const totalAmount = jarContributions.reduce((sum, contribution) => {
              const amount = typeof contribution.amount === 'string' 
                ? parseFloat(contribution.amount) 
                : contribution.amount;
              return sum + (isNaN(amount) ? 0 : amount);
            }, 0);
            
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
              coinjar_contributions: jarContributions
            } as CoinJar;
          });
        } else {
          // Create a dummy jar if no jars were found
          const dummyJar: CoinJar = {
            id: "dummy-jar-id",
            name: "Birthday Gift for Mom",
            relationship: "Mother",
            created_at: new Date().toISOString(),
            total_amount: 75,
            target_amount: 150,
            percent_complete: 50,
            delivery_status: "processing",
            coinjar_contributions: [
              { amount: 50 },
              { amount: 25 }
            ],
            creator_id: userId
          };
          
          enhancedJars = [dummyJar];
          console.log("No jars found, created dummy jar:", dummyJar);
        }
        
        setMyJars(enhancedJars);
        
        // STEP 3: Fetch invitations with a direct, flat query
        // The RLS policy will limit to only invitations for this user
        const { data: invitations, error: invitationsError } = await supabase
          .from('coinjar_invitations')
          .select('id, coinjar_id')
          .eq('accepted', false);
          
        if (invitationsError) {
          console.error('Error fetching invitations:', invitationsError);
          setInvitedJars([]);
        } else if (invitations && invitations.length > 0) {
          // Get all jar IDs from invitations
          const invitedJarIds = invitations.map(inv => inv.coinjar_id);
          
          // Fetch all invited jars in a single batch query
          const { data: invitedJarsData, error: invitedJarsError } = await supabase
            .from('recipient_coinjar')
            .select('id, name, relationship, created_at, creator_id')
            .in('id', invitedJarIds);
            
          if (invitedJarsError) {
            console.error('Error fetching invited jars batch:', invitedJarsError);
            setInvitedJars([]);
          } else {
            // Process invited jars
            const invitedJarsMap = new Map();
            invitedJarsData?.forEach(jar => {
              invitedJarsMap.set(jar.id, jar);
            });
            
            const processedInvitations = invitations
              .map(invitation => {
                const jarData = invitedJarsMap.get(invitation.coinjar_id);
                if (!jarData) return null;
                
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
              })
              .filter(Boolean) as InvitedJar[];
            
            setInvitedJars(processedInvitations);
          }
        } else {
          setInvitedJars([]);
        }
        
        // Create dummy notification
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
