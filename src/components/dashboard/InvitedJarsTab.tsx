
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { InvitedJar } from "@/types/dashboard";
import { CoinJarCard } from "./CoinJarCard";

interface InvitedJarsTabProps {
  invitedJars: InvitedJar[];
}

export const InvitedJarsTab = ({ invitedJars }: InvitedJarsTabProps) => {
  if (invitedJars.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Users className="w-12 h-12 text-muted-foreground" />
          <h3 className="text-xl font-medium">No Invitations</h3>
        </div>
        <p className="text-muted-foreground">
          You haven't been invited to contribute to any CoinJars yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {invitedJars.map((jar) => (
        <CoinJarCard key={jar.id} jar={jar} showContribute={true} />
      ))}
    </div>
  );
};
