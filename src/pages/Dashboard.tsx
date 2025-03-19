
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PiggyBank, Bell, Users, Coins, CheckCircle2, Clock, AlertCircle, Gift, Plus } from "lucide-react";

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
          const totalAmount = jar.coinjar_contributions.reduce(
            (sum, contribution) => sum + parseFloat(contribution.amount), 
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
            percent_complete: percentComplete // This is a number, which is what Progress expects
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'pending':
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'processing':
        return 'Processing';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  // Loading skeleton state
  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-2 w-full my-4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-primary" />
                <CardTitle>My CoinJars</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{myJars.length}</p>
              <p className="text-muted-foreground">Active collection jars</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <CardTitle>Total Collected</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${myJars.reduce((sum, jar) => sum + jar.total_amount, 0).toFixed(2)}
              </p>
              <p className="text-muted-foreground">Across all jars</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{notifications.filter(n => !n.read).length}</p>
              <p className="text-muted-foreground">Unread notifications</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="my-jars" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="my-jars">My CoinJars</TabsTrigger>
            <TabsTrigger value="invitations">Invited Jars</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-jars">
            {myJars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myJars.map((jar) => (
                  <Card key={jar.id} className="glass-card hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{jar.name}</CardTitle>
                          <CardDescription>{jar.relationship}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {getStatusIcon(jar.delivery_status)}
                          <span>{getStatusText(jar.delivery_status)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            ${jar.total_amount.toFixed(2)} of ${jar.target_amount}
                          </span>
                        </div>
                        <Progress value={jar.percent_complete} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">
                            {new Date(jar.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contributions</p>
                          <p className="font-medium">{jar.coinjar_contributions.length}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <Gift className="w-12 h-12 text-muted-foreground" />
                  <h3 className="text-xl font-medium">No CoinJars Yet</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Create your first CoinJar to start collecting funds for a loved one.
                </p>
                <Link to="/recipient-profile">
                  <Button>Create CoinJar</Button>
                </Link>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="invitations">
            {invitedJars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {invitedJars.map((jar) => (
                  <Card key={jar.id} className="glass-card hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{jar.name}</CardTitle>
                          <CardDescription>{jar.relationship}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-5 h-5 text-primary" />
                          <span>Invited</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            ${jar.total_amount} of ${jar.target_amount}
                          </span>
                        </div>
                        <Progress value={jar.percent_complete} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3">
                      <Button variant="outline" className="w-full">View Details</Button>
                      <Button className="w-full">Contribute</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <Users className="w-12 h-12 text-muted-foreground" />
                  <h3 className="text-xl font-medium">No Invitations</h3>
                </div>
                <p className="text-muted-foreground">
                  You haven't been invited to contribute to any CoinJars yet.
                </p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="notifications">
            {notifications.length > 0 ? (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Notification</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification) => (
                      <TableRow key={notification.id} className={notification.read ? "" : "font-medium bg-muted/50"}>
                        <TableCell className="flex items-center gap-2">
                          {notification.type === 'contribution' ? (
                            <Coins className="w-4 h-4 text-primary" />
                          ) : (
                            <Users className="w-4 h-4 text-primary" />
                          )}
                          {notification.message}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {notification.read ? 
                            <span className="text-muted-foreground">Read</span> : 
                            <span className="text-primary">New</span>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <Bell className="w-12 h-12 text-muted-foreground" />
                  <h3 className="text-xl font-medium">No Notifications</h3>
                </div>
                <p className="text-muted-foreground">
                  You don't have any notifications at this time.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
