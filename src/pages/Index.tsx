
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, CreditCard, ChartBar } from "lucide-react";
import { Link } from "react-router-dom";
import { MainNav } from "@/components/MainNav";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <MainNav />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 slide-up">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Family Support Made Simple
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              If we all contribute, nothing is impossible
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create sustainable support for your loved ones through organized monthly contributions.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full px-8">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scale-in">
            <Card className="p-6 glass-card hover:scale-105 transition-transform duration-300">
              <Heart className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Support Together</h3>
              <p className="text-sm text-muted-foreground">
                Pool resources with family members to make a meaningful impact.
              </p>
            </Card>

            <Card className="p-6 glass-card hover:scale-105 transition-transform duration-300">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Easy Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Invite family members and manage contributions seamlessly.
              </p>
            </Card>

            <Card className="p-6 glass-card hover:scale-105 transition-transform duration-300">
              <CreditCard className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Flexible Payments</h3>
              <p className="text-sm text-muted-foreground">
                Set up automatic contributions based on your schedule.
              </p>
            </Card>

            <Card className="p-6 glass-card hover:scale-105 transition-transform duration-300">
              <ChartBar className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Track Impact</h3>
              <p className="text-sm text-muted-foreground">
                Monitor the collective support provided over time.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
