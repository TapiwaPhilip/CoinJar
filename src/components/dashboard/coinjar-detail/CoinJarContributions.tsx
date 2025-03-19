
import React from "react";
import { Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "./CoinJarDetailUtils";

interface Contributor {
  id: number;
  name: string;
  amount: number;
  date: string;
}

interface CoinJarContributionsProps {
  contributors: Contributor[];
}

export const CoinJarContributions = ({ contributors }: CoinJarContributionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributions</CardTitle>
        <CardDescription>
          All contributions made to this CoinJar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {contributors.length === 0 ? (
          <div className="text-center py-6">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No contributions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributors.map((contributor) => (
              <div key={contributor.id} className="flex justify-between items-center p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{contributor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(contributor.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${formatCurrency(contributor.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
