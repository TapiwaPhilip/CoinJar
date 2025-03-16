
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-6xl">
        <Card className="bordered-card overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-soft-blue/30 to-white border-b border-divider">
            <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your family circle contributions</p>
          </div>
          
          <div className="bordered-section px-6">
            <h2 className="text-xl font-medium mb-2">Getting Started</h2>
            <p className="text-muted-foreground text-sm mb-4">Follow these steps to set up your Family Funds Circle</p>
          </div>
          
          {/* Empty state with improved styling */}
          <CardContent className="p-8">
            <div className="text-center py-12 px-6 soft-container">
              <div className="highlighted-content mb-6 inline-block mx-auto">
                <h2 className="text-2xl font-semibold mb-2">Welcome to Family Funds Circle</h2>
                <p className="text-muted-foreground">Let's get started by creating a recipient profile.</p>
              </div>
              <div className="content-divider"></div>
              <Link to="/recipient-profile">
                <Button size="lg" className="rounded-full px-8 shadow-md hover:shadow-lg transition-shadow">
                  Create Recipient Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
