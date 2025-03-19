
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CoinJar } from "@/types/dashboard";

interface CoinJarDetailsProps {
  jar: CoinJar;
}

export const CoinJarDetails = ({ jar }: CoinJarDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipient Details</CardTitle>
        <CardDescription>
          Information about the recipient of this CoinJar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{jar.name}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground">Relationship</p>
            <p className="font-medium">{jar.relationship}</p>
          </div>
          {jar.email && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{jar.email}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
