
import { ArrowUpRight, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CoinJarCardActionsProps {
  jarId: string;
  showContribute?: boolean;
}

export const CoinJarCardActions = ({ jarId, showContribute = false }: CoinJarCardActionsProps) => {
  if (showContribute) {
    return (
      <Button variant="outline" className="w-full">
        Contribute
      </Button>
    );
  }

  return (
    <>
      <Link to={`/coinjar/${jarId}`} className="flex-1">
        <Button variant="outline" className="w-full">
          View Details
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
      <Link to={`/edit-recipient/${jarId}`}>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
    </>
  );
};
