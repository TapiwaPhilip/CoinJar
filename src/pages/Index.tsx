
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, CreditCard, ChartBar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 border-b border-divider-light">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 slide-up">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              Family Support Made Simple
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              If we all contribute, nothing is impossible
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Create sustainable support for your loved ones through organized monthly contributions.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full px-8 shadow-md hover:shadow-lg transition-shadow">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scale-in">
            <Card className="subtle-card p-6 hover:scale-105 transition-transform duration-300">
              <div className="rounded-full bg-soft-blue/30 w-16 h-16 flex items-center justify-center mb-4 border border-soft-blue/50">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Support Together</h3>
              <div className="w-12 h-1 bg-primary/30 mb-3 rounded-full"></div>
              <p className="text-sm text-muted-foreground">
                Pool resources with family members to make a meaningful impact.
              </p>
            </Card>

            <Card className="subtle-card p-6 hover:scale-105 transition-transform duration-300">
              <div className="rounded-full bg-soft-green/30 w-16 h-16 flex items-center justify-center mb-4 border border-soft-green/50">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy Collaboration</h3>
              <div className="w-12 h-1 bg-green-600/30 mb-3 rounded-full"></div>
              <p className="text-sm text-muted-foreground">
                Invite family members and manage contributions seamlessly.
              </p>
            </Card>

            <Card className="subtle-card p-6 hover:scale-105 transition-transform duration-300">
              <div className="rounded-full bg-soft-yellow/30 w-16 h-16 flex items-center justify-center mb-4 border border-soft-yellow/50">
                <CreditCard className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Payments</h3>
              <div className="w-12 h-1 bg-yellow-600/30 mb-3 rounded-full"></div>
              <p className="text-sm text-muted-foreground">
                Set up automatic contributions based on your schedule.
              </p>
            </Card>

            <Card className="subtle-card p-6 hover:scale-105 transition-transform duration-300">
              <div className="rounded-full bg-soft-blue/30 w-16 h-16 flex items-center justify-center mb-4 border border-soft-blue/50">
                <ChartBar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Track Impact</h3>
              <div className="w-12 h-1 bg-blue-600/30 mb-3 rounded-full"></div>
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
