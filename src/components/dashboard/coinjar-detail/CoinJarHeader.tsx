
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getStatusIcon, getStatusText } from "../DashboardUtils";
import { CoinJar } from "@/types/dashboard";

interface CoinJarHeaderProps {
  jar: CoinJar;
  isCreator: boolean;
}

export const CoinJarHeader = ({ jar, isCreator }: CoinJarHeaderProps) => {
  return (
    <>
      <div className="mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6 glass-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl">{jar.name}</CardTitle>
              <CardDescription className="text-lg">{jar.relationship}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-1.5 rounded-full">
                {getStatusIcon(jar.delivery_status)}
                <span>{getStatusText(jar.delivery_status)}</span>
              </div>
              {isCreator && (
                <Link to={`/edit-recipient/${jar.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};
