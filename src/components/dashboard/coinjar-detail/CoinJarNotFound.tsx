
import React from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const CoinJarNotFound = () => {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card className="p-6 text-center">
        <CardContent className="pt-6">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">CoinJar Not Found</h3>
          <p className="text-muted-foreground mb-6">
            The CoinJar you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
