
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoinJar } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { CoinJarDetailSkeleton } from "./coinjar-detail/CoinJarDetailSkeleton";
import { CoinJarNotFound } from "./coinjar-detail/CoinJarNotFound";
import { CoinJarHeader } from "./coinjar-detail/CoinJarHeader";
import { CoinJarProgress } from "./coinjar-detail/CoinJarProgress";
import { CoinJarStats } from "./coinjar-detail/CoinJarStats";
import { CoinJarContributions } from "./coinjar-detail/CoinJarContributions";
import { CoinJarDetails } from "./coinjar-detail/CoinJarDetails";

const CoinJarDetail = () => {
  const [jar, setJar] = useState<CoinJar | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributors, setContributors] = useState<any[]>([]);
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchJarDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch CoinJar details without including the coinjar_invitations
        // which was causing the recursive policy issue
        const { data: jarData, error: jarError } = await supabase
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
          .eq('id', id)
          .single();
          
        if (jarError) throw jarError;
        
        // Calculate totals
        const totalAmount = jarData.coinjar_contributions.reduce(
          (sum, contribution) => {
            // Handle both string and number types for amount
            const amount = typeof contribution.amount === 'string' 
              ? parseFloat(contribution.amount) 
              : contribution.amount;
            return sum + amount;
          }, 
          0
        );
        
        // Mock data for demo - in production, this would come from the database
        const deliveryStatuses = ['pending', 'processing', 'delivered'];
        const randomStatus = deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)] as 'pending' | 'processing' | 'delivered';
        
        const targetAmount = 100; // Example target, replace with real target from DB
        const percentComplete = Math.min(100, Math.round((totalAmount / targetAmount) * 100));
        
        // Create a new object with the correct types
        const processedJar: CoinJar = {
          ...jarData,
          total_amount: totalAmount,
          delivery_status: randomStatus,
          target_amount: targetAmount,
          percent_complete: percentComplete,
          // Convert contribution amounts to numbers
          coinjar_contributions: jarData.coinjar_contributions.map(contribution => ({
            amount: typeof contribution.amount === 'string' ? parseFloat(contribution.amount) : contribution.amount
          }))
        };
        
        setJar(processedJar);
        
        // Mock contributors for demo - replace with real data in production
        setContributors([
          { id: 1, name: "Jane Smith", amount: 25, date: new Date().toISOString() },
          { id: 2, name: "John Doe", amount: 50, date: new Date(Date.now() - 86400000).toISOString() }
        ]);
        
      } catch (error) {
        console.error('Error fetching jar details:', error);
        toast({
          title: "Failed to load CoinJar details",
          description: "There was an error loading the details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJarDetails();
  }, [id, toast]);
  
  if (loading) {
    return <CoinJarDetailSkeleton />;
  }
  
  if (!jar) {
    return <CoinJarNotFound />;
  }

  // Check if the current user is the creator of the jar
  const isCreator = user && jar && user.id === jar.creator_id;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-4xl">
        <CoinJarHeader jar={jar} isCreator={isCreator} />
        
        {/* CoinJar Content */}
        <div className="card glass-card mb-6">
          <CardContent className="p-6">
            <CoinJarProgress 
              totalAmount={jar.total_amount} 
              targetAmount={jar.target_amount} 
              percentComplete={jar.percent_complete} 
            />
            
            <CoinJarStats 
              jar={jar} 
              contributorsCount={contributors.length} 
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full">Contribute to this CoinJar</Button>
          </CardFooter>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="contributions" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contributions">
            <CoinJarContributions contributors={contributors} />
          </TabsContent>
          
          <TabsContent value="details">
            <CoinJarDetails jar={jar} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoinJarDetail;
