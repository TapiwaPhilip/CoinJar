
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gift, Filter } from "lucide-react";
import { CoinJar } from "@/types/dashboard";
import { CoinJarCard } from "./CoinJarCard";
import { filterJarsByStatus } from "./DashboardUtils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface MyJarsTabProps {
  myJars: CoinJar[];
}

export const MyJarsTab = ({ myJars }: MyJarsTabProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filteredJars = filterJarsByStatus(myJars, statusFilter);

  if (myJars.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Gift className="w-12 h-12 text-muted-foreground" />
          <h3 className="text-xl font-medium">No CoinJars Yet</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Create your first CoinJar to start collecting funds for a loved one.
        </p>
        <Link to="/recipient-profile">
          <Button>Create CoinJar</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredJars.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            No CoinJars match the selected filter.
          </p>
          <Button variant="outline" onClick={() => setStatusFilter("all")}>
            Clear Filter
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJars.map((jar) => (
            <CoinJarCard key={jar.id} jar={jar} />
          ))}
        </div>
      )}
    </div>
  );
};
