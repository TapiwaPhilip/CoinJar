
import React from "react";

export const CoinJarDetailSkeleton = () => {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-muted rounded"></div>
        <div className="h-32 bg-muted rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
        <div className="h-40 bg-muted rounded"></div>
      </div>
    </div>
  );
};
