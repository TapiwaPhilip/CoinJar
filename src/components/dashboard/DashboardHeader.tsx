
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  signOut: () => void;
  isMobile?: boolean;
}

export const DashboardHeader = ({ signOut, isMobile }: DashboardHeaderProps) => {
  return (
    <div className="mb-6">
      <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start md:items-center gap-4 md:gap-0`}>
        <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
        
        <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row'} gap-2`}>
          <Link to="/recipient-profile" className={isMobile ? 'w-full' : ''}>
            <Button className={`rounded-full gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
              <Plus className="w-4 h-4" />
              Create New CoinJar
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className={`rounded-full gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all ${isMobile ? 'w-full justify-center' : ''}`}
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
