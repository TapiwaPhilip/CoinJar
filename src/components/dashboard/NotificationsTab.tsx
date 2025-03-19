
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Coins, Users } from "lucide-react";
import { Notification } from "@/types/dashboard";

interface NotificationsTabProps {
  notifications: Notification[];
}

export const NotificationsTab = ({ notifications }: NotificationsTabProps) => {
  if (notifications.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Bell className="w-12 h-12 text-muted-foreground" />
          <h3 className="text-xl font-medium">No Notifications</h3>
        </div>
        <p className="text-muted-foreground">
          You don't have any notifications at this time.
        </p>
      </Card>
    );
  }

  return (
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
  );
};
