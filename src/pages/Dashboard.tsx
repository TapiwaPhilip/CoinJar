
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { MyJarsTab } from "@/components/dashboard/MyJarsTab";
import { InvitedJarsTab } from "@/components/dashboard/InvitedJarsTab";
import { NotificationsTab } from "@/components/dashboard/NotificationsTab";
import { LoadingDashboard } from "@/components/dashboard/LoadingDashboard";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [myJars, setMyJars] = useState([]);
  const [invitedJars, setInvitedJars] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch CoinJars created by the user
        const { data: createdJars, error: createdJarsError } = await supabase
          .from('recipient_coinjar')
          .select(`
            id, 
            name, 
            relationship, 
            email, 
            created_at,
            coinjar_contributions(amount)
          `)
          .eq('creator_id', user.id);
        
        if (createdJarsError) throw createdJarsError;
        
        // Calculate total contributions for each jar
        const jarsWithTotals = createdJars.map(jar => {
          // Convert amount to number before summing them
          const totalAmount = jar.coinjar_contributions.reduce(
            (sum, contribution) => sum + (typeof contribution.amount === 'string' ? parseFloat(contribution.amount) : contribution.amount), 
            0
          );
          
          // Random delivery status for demo purposes - replace with real status in production
          const deliveryStatuses = ['pending', 'processing', 'delivered'];
          const randomStatus = deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)];
          
          // Fix the type error by ensuring target_amount and percent_complete are numbers
          const targetAmount = 100; // Example target, replace with real target from DB
          const percentComplete = Math.min(100, Math.round((totalAmount / targetAmount) * 100));
          
          return {
            ...jar,
            total_amount: totalAmount,
            delivery_status: randomStatus,
            target_amount: targetAmount,
            percent_complete: percentComplete,
            // Convert contribution amounts to numbers if they are strings
            coinjar_contributions: jar.coinjar_contributions.map(contribution => ({
              amount: typeof contribution.amount === 'string' ? parseFloat(contribution.amount) : contribution.amount
            }))
          };
        });
        
        setMyJars(jarsWithTotals);
        
        // Fetch mock invitations (replace with real query)
        // For demo purposes - replace with real invitation data in production
        setInvitedJars([
          {
            id: 'mock-1',
            name: 'Colleague\'s Birthday',
            relationship: 'Work',
            total_amount: 75,
            target_amount: 150,
            percent_complete: 50,
            delivery_status: 'pending'
          }
        ]);
        
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
      } catch (error) {
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
  }, [user, toast]);

  // Loading skeleton state
  if (loading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <Link to="/recipient-profile">
            <Button className="rounded-full gap-2">
              <Plus className="w-4 h-4" />
              Create New CoinJar
            </Button>
          </Link>
        </div>

        <DashboardSummary myJars={myJars} notifications={notifications} />

        <Tabs defaultValue="my-jars" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="my-jars">My CoinJars</TabsTrigger>
            <TabsTrigger value="invitations">Invited Jars</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-jars">
            <MyJarsTab myJars={myJars} />
          </TabsContent>
          
          <TabsContent value="invitations">
            <InvitedJarsTab invitedJars={invitedJars} />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsTab notifications={notifications} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
