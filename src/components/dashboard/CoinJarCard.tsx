
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getStatusIcon, getStatusText } from "./DashboardUtils";
import { Link } from "react-router-dom";

interface CoinJarCardProps {
  jar: {
    id: string;
    name: string;
    relationship: string;
    total_amount: number;
    target_amount: number;
    percent_complete: number;
    delivery_status: string;
    created_at?: string;
    coinjar_contributions?: Array<{ amount: number }>;  // Updated to number
  };
  showContribute?: boolean;
}

export const CoinJarCard = ({ jar, showContribute = false }: CoinJarCardProps) => {
  return (
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
        
        {jar.created_at && jar.coinjar_contributions && (
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
        )}
      </CardContent>
      <CardFooter className={showContribute ? "flex gap-3" : ""}>
        <Link to={`/coinjar/${jar.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
        {showContribute && <Button className="w-full">Contribute</Button>}
      </CardFooter>
    </Card>
  );
};
