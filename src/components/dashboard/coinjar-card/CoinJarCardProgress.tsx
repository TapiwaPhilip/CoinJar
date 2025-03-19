
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "./CoinJarCardUtils";

interface CoinJarCardProgressProps {
  totalAmount: number;
  targetAmount: number;
  percentComplete: number;
}

export const CoinJarCardProgress = ({ 
  totalAmount,
  targetAmount,
  percentComplete
}: CoinJarCardProgressProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-muted-foreground">
          ${formatCurrency(totalAmount)} of ${targetAmount}
        </span>
      </div>
      <Progress value={percentComplete} className="h-2" />
    </div>
  );
};
