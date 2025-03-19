
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function MainNav() {
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
        <Link to="/auth">
          <Button variant="outline" className="rounded-full px-4 py-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
