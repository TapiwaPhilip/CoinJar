
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { MyJarsTab } from "@/components/dashboard/MyJarsTab";
import { InvitedJarsTab } from "@/components/dashboard/InvitedJarsTab";
import { NotificationsTab } from "@/components/dashboard/NotificationsTab";
import { LoadingDashboard } from "@/components/dashboard/LoadingDashboard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const { loading, myJars, invitedJars, notifications } = useDashboardData(user?.id);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth", { state: { returnTo: "/dashboard" } });
    }
  }, [user, isLoading, navigate]);

  // Loading skeleton state
  if (isLoading || loading) {
    return <LoadingDashboard />;
  }

  // This shouldn't happen if the redirect in useEffect works, but just in case
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <DashboardHeader />
          <Button 
            variant="outline" 
            className="rounded-full px-4 py-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
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
