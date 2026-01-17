import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Box, LogOut, LayoutDashboard, Calendar } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 font-display font-bold text-xl text-foreground">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Box className="w-5 h-5" />
            </div>
            StandPlanet
          </a>
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              {user.role === "organizer" ? (
                <Link href="/organizer">
                  <a className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/organizer') ? 'text-primary' : 'text-muted-foreground'}`}>
                    Organizer Dashboard
                  </a>
                </Link>
              ) : (
                <Link href="/exhibitor">
                  <a className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/exhibitor') ? 'text-primary' : 'text-muted-foreground'}`}>
                    My Events
                  </a>
                </Link>
              )}
              
              <div className="h-4 w-px bg-border mx-2" />
              
              <span className="text-sm text-foreground font-medium hidden md:block">
                {user.fullName || user.username || user.email}
              </span>
              
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="premium">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
