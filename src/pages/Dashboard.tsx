
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-6xl">
        {/* Placeholder for future implementation */}
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Family Funds Circle</h2>
          <p className="text-muted-foreground mb-8">Let's get started by creating a recipient profile.</p>
          <Link to="/recipient-profile">
            <Button size="lg" className="rounded-full px-8">
              Create Recipient Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

