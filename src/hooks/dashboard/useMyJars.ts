
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CoinJar } from "@/types/dashboard";
import { useToast } from "@/hooks/use-toast";
import { enhanceJarsWithContributions } from "./dashboardUtils";

export const useMyJars = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [myJars, setMyJars] = useState<CoinJar[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    
    async function fetchMyJars() {
      try {
        // Fetch CoinJars created by the current user
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
          return [];
        }
        
        console.log("Retrieved basic jars data:", myJarsBasic);
        
        if (myJarsBasic && myJarsBasic.length > 0) {
          // Get jar ids for batch query
          const jarIds = myJarsBasic.map(jar => jar.id);
          
          // Fetch all contributions in a single batch query
          const { data: allContributions, error: batchContribError } = await supabase
            .from('coinjar_contributions')
            .select('coinjar_id, amount')
            .in('coinjar_id', jarIds);
            
          if (batchContribError) {
            console.error("Error fetching contributions batch:", batchContribError);
          }
          
          // Process jars with their contributions
          const enhancedJars = enhanceJarsWithContributions(myJarsBasic, allContributions || []);
          setMyJars(enhancedJars);
          return enhancedJars;
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
          
          setMyJars([dummyJar]);
          console.log("No jars found, created dummy jar:", dummyJar);
          return [dummyJar];
        }
      } catch (error: any) {
        console.error("Error in useMyJars:", error);
        return [];
      } finally {
        setLoading(false);
      }
    }
    
    fetchMyJars();
  }, [userId, toast]);

  return {
    loading,
    myJars
  };
};
