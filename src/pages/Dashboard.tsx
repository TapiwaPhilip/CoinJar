
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { MyJarsTab } from "@/components/dashboard/MyJarsTab";
import { InvitedJarsTab } from "@/components/dashboard/InvitedJarsTab";
import { NotificationsTab } from "@/components/dashboard/NotificationsTab";
import { LoadingDashboard } from "@/components/dashboard/LoadingDashboard";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { user } = useAuth();
  const { loading, myJars, invitedJars, notifications } = useDashboardData(user?.id);

  // Loading skeleton state
  if (loading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-6xl">
        <DashboardHeader />
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
