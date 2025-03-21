
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const { loading, myJars, invitedJars, notifications } = useDashboardData(user?.id);
  const isMobile = useIsMobile();

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
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-background to-muted relative">
      <div className="container mx-auto max-w-6xl">
        <DashboardHeader signOut={signOut} isMobile={isMobile} showSignOutButton={!isMobile} />
        
        <DashboardSummary myJars={myJars} notifications={notifications} />

        <Tabs defaultValue="my-jars" className="mb-8">
          <TabsList className={`mb-4 ${isMobile ? 'flex w-full' : ''}`}>
            <TabsTrigger value="my-jars" className={isMobile ? 'flex-1' : ''}>My CoinJars</TabsTrigger>
            <TabsTrigger value="invitations" className={isMobile ? 'flex-1' : ''}>Invited Jars</TabsTrigger>
            <TabsTrigger value="notifications" className={isMobile ? 'flex-1' : ''}>Notifications</TabsTrigger>
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
        
        {/* Mobile Sign Out button at bottom */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border z-10">
            <Button 
              variant="outline" 
              className="w-full rounded-full gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all justify-center"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
