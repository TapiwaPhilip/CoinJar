
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InvitedJar } from "@/types/dashboard";
import { useToast } from "@/hooks/use-toast";

export const useInvitedJars = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [invitedJars, setInvitedJars] = useState<InvitedJar[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    
    async function fetchInvitedJars() {
      try {
        // Fetch invitations with a direct, flat query
        const { data: invitations, error: invitationsError } = await supabase
          .from('coinjar_invitations')
          .select('id, coinjar_id')
          .eq('accepted', false);
          
        if (invitationsError) {
          console.error('Error fetching invitations:', invitationsError);
          setInvitedJars([]);
          return [];
        } 
        
        if (invitations && invitations.length > 0) {
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
            return [];
          } 
          
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
          return processedInvitations;
        } else {
          setInvitedJars([]);
          return [];
        }
      } catch (error: any) {
        console.error('Error in useInvitedJars:', error);
        return [];
      } finally {
        setLoading(false);
      }
    }
    
    fetchInvitedJars();
  }, [userId, toast]);

  return {
    loading,
    invitedJars
  };
};
