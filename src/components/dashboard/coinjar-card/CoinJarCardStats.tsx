
import { Clock, DollarSign } from "lucide-react";
import { formatDate } from "./CoinJarCardUtils";

interface CoinJarCardStatsProps {
  createdAt: string;
  contributionsCount: number;
}

export const CoinJarCardStats = ({ createdAt, contributionsCount }: CoinJarCardStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">Created</p>
          <p className="text-sm font-medium">{formatDate(createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">Contributions</p>
          <p className="text-sm font-medium">{contributionsCount}</p>
        </div>
      </div>
    </div>
  );
};
