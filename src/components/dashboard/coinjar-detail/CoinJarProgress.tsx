
import React from "react";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "./CoinJarDetailUtils";

interface CoinJarProgressProps {
  totalAmount: number;
  targetAmount: number;
  percentComplete: number;
}

export const CoinJarProgress = ({ totalAmount, targetAmount, percentComplete }: CoinJarProgressProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-muted-foreground">
          ${formatCurrency(totalAmount)} of ${targetAmount}
        </span>
      </div>
      <Progress value={percentComplete} className="h-2" />
      <p className="mt-2 text-sm text-muted-foreground text-right">
        {percentComplete}% Complete
      </p>
    </div>
  );
};
