
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function MainNav() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <NavigationMenu>
        <NavigationMenuList>
          <Link to="/" className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Family Funds Circle
          </Link>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-4">
        {isLoading ? (
          <Button variant="outline" className="rounded-full px-4 py-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all" disabled>
            Loading...
          </Button>
        ) : user ? (
          <>
            <Link to="/dashboard">
              <Button variant="outline" className="rounded-full px-4 py-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all">
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="rounded-full px-4 py-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button variant="outline" className="rounded-full px-4 py-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
