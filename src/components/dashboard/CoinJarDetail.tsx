
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If user is not authenticated, redirect to auth page
      navigate("/auth");
      return;
    }

    const fetchJarDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        console.log("Fetching CoinJar with ID:", id);
        console.log("Current user ID:", user?.id);
        
        // Fetch basic CoinJar details without nesting relations
        const { data: jarData, error: jarError } = await supabase
          .from('recipient_coinjar')
          .select(`
            id, 
            name, 
            relationship, 
            email, 
            created_at,
            creator_id
          `)
          .eq('id', id)
          .maybeSingle();
          
        if (jarError) {
          console.error('Error fetching jar details:', jarError);
          throw jarError;
        }
        
        if (!jarData) {
          console.log("No jar data found for ID:", id);
          setJar(null);
          setLoading(false);
          return;
        }
        
        console.log("Retrieved jar data:", jarData);
        
        // Fetch contributions separately
        const { data: contributions, error: contribError } = await supabase
          .from('coinjar_contributions')
          .select('amount')
          .eq('coinjar_id', id);
          
        if (contribError) {
          console.error('Error fetching contributions:', contribError);
        }
        
        // Calculate totals
        const totalAmount = contributions ? contributions.reduce(
          (sum, contribution) => {
            // Handle both string and number types for amount
            const amount = typeof contribution.amount === 'string' 
              ? parseFloat(contribution.amount) 
              : contribution.amount;
            return sum + (isNaN(amount) ? 0 : amount);
          }, 
          0
        ) : 0;
        
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
          coinjar_contributions: contributions ? contributions.map(contribution => ({
            amount: typeof contribution.amount === 'string' ? parseFloat(contribution.amount) : contribution.amount
          })) : []
        };
        
        setJar(processedJar);
        
        // Fetch real contributors from the database if available
        // For now, using mock data
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
  }, [id, toast, user, navigate]);
  
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
