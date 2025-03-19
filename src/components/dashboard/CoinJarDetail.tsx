
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Users, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusIcon, getStatusText } from "./DashboardUtils";
import { CoinJar } from "@/types/dashboard";
import { Separator } from "@/components/ui/separator";

const CoinJarDetail = () => {
  const [jar, setJar] = useState<CoinJar | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributors, setContributors] = useState<any[]>([]);
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchJarDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch CoinJar details
        const { data: jarData, error: jarError } = await supabase
          .from('recipient_coinjar')
          .select(`
            id, 
            name, 
            relationship, 
            email, 
            created_at,
            coinjar_contributions(amount)
          `)
          .eq('id', id)
          .single();
          
        if (jarError) throw jarError;
        
        // Calculate totals
        const totalAmount = jarData.coinjar_contributions.reduce(
          (sum, contribution) => sum + parseFloat(contribution.amount), 
          0
        );
        
        // Mock data for demo - in production, this would come from the database
        const deliveryStatuses = ['pending', 'processing', 'delivered'];
        const randomStatus = deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)];
        
        const targetAmount = 100; // Example target, replace with real target from DB
        const percentComplete = Math.min(100, Math.round((totalAmount / targetAmount) * 100));
        
        const jarWithDetails = {
          ...jarData,
          total_amount: totalAmount,
          delivery_status: randomStatus,
          target_amount: targetAmount,
          percent_complete: percentComplete
        };
        
        setJar(jarWithDetails as CoinJar);
        
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
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!jar) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card className="p-6 text-center">
          <CardContent className="pt-6">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">CoinJar Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The CoinJar you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {/* CoinJar Header */}
        <Card className="mb-6 glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl">{jar.name}</CardTitle>
                <CardDescription className="text-lg">{jar.relationship}</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-1.5 rounded-full">
                {getStatusIcon(jar.delivery_status)}
                <span>{getStatusText(jar.delivery_status)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  ${jar.total_amount.toFixed(2)} of ${jar.target_amount}
                </span>
              </div>
              <Progress value={jar.percent_complete} className="h-2" />
              <p className="mt-2 text-sm text-muted-foreground text-right">
                {jar.percent_complete}% Complete
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(jar.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contributors</p>
                  <p className="font-medium">{contributors.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average</p>
                  <p className="font-medium">
                    ${contributors.length ? (jar.total_amount / contributors.length).toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Contribute to this CoinJar</Button>
          </CardFooter>
        </Card>
        
        {/* Tabs */}
        <Tabs defaultValue="contributions" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contributions">
            <Card>
              <CardHeader>
                <CardTitle>Contributions</CardTitle>
                <CardDescription>
                  All contributions made to this CoinJar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contributors.length === 0 ? (
                  <div className="text-center py-6">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No contributions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contributors.map((contributor) => (
                      <div key={contributor.id} className="flex justify-between items-center p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">{contributor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(contributor.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${contributor.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Recipient Details</CardTitle>
                <CardDescription>
                  Information about the recipient of this CoinJar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{jar.name}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-medium">{jar.relationship}</p>
                  </div>
                  {jar.email && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{jar.email}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoinJarDetail;
