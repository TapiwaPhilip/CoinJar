
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <Link to="/recipient-profile">
        <Button className="rounded-full gap-2">
          <Plus className="w-4 h-4" />
          Create New CoinJar
        </Button>
      </Link>
    </div>
  );
};
