
import { ArrowUpRight, Clock, DollarSign, Edit } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { getStatusIcon } from "./DashboardUtils";
import { CoinJar } from "@/types/dashboard";

interface CoinJarCardProps {
  jar: CoinJar;
  showContribute?: boolean;
}

export const CoinJarCard = ({ jar, showContribute = false }: CoinJarCardProps) => {
  return (
    <Card className="h-full glass-card">
      <CardContent className="p-6">
        <div className="flex justify-between mb-3">
          <div>
            <h3 className="text-lg font-medium">{jar.name}</h3>
            <p className="text-sm text-muted-foreground">{jar.relationship}</p>
          </div>
          <div className="flex items-center gap-1 text-sm bg-muted/50 px-2 py-1 rounded-full h-fit">
            {getStatusIcon(jar.delivery_status)}
            <span className="sr-only md:not-sr-only md:inline">{jar.delivery_status}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              ${jar.total_amount.toFixed(2)} of ${jar.target_amount}
            </span>
          </div>
          <Progress value={jar.percent_complete} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium">{new Date(jar.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Contributions</p>
              <p className="text-sm font-medium">{jar.coinjar_contributions?.length || 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2">
        {showContribute ? (
          <Button variant="outline" className="w-full">
            Contribute
          </Button>
        ) : (
          <>
            <Link to={`/coinjar/${jar.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to={`/edit-recipient/${jar.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
