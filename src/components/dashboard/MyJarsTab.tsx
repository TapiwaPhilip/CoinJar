
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gift } from "lucide-react";
import { CoinJar } from "@/types/dashboard";
import { CoinJarCard } from "./CoinJarCard";

interface MyJarsTabProps {
  myJars: CoinJar[];
}

export const MyJarsTab = ({ myJars }: MyJarsTabProps) => {
  if (myJars.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {myJars.map((jar) => (
        <CoinJarCard key={jar.id} jar={jar} />
      ))}
    </div>
  );
};
