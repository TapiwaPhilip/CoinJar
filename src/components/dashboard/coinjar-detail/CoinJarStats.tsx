
import React from "react";
import { Calendar, Users, DollarSign } from "lucide-react";
import { formatCurrency, formatDate } from "./CoinJarDetailUtils";
import { CoinJar } from "@/types/dashboard";

interface CoinJarStatsProps {
  jar: CoinJar;
  contributorsCount: number;
}

export const CoinJarStats = ({ jar, contributorsCount }: CoinJarStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2.5 rounded-full">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Created</p>
          <p className="font-medium">{formatDate(jar.created_at)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2.5 rounded-full">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Contributors</p>
          <p className="font-medium">{contributorsCount}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2.5 rounded-full">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Average</p>
          <p className="font-medium">
            ${contributorsCount ? formatCurrency(jar.total_amount / contributorsCount) : "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
};
