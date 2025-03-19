
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank, Bell, Coins } from "lucide-react";
import { CoinJar, Notification } from "@/types/dashboard";

interface DashboardSummaryProps {
  myJars: CoinJar[];
  notifications: Notification[];
}

export const DashboardSummary = ({ myJars, notifications }: DashboardSummaryProps) => {
  const totalCollected = myJars.reduce((sum, jar) => sum + jar.total_amount, 0).toFixed(2);
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  return (
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
            ${totalCollected}
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
          <p className="text-3xl font-bold">{unreadNotifications}</p>
          <p className="text-muted-foreground">Unread notifications</p>
        </CardContent>
      </Card>
    </div>
  );
};
