import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Dashboard from "@/pages/Organizer/Dashboard";
import BoothConfigurator from "@/pages/Exhibitor/BoothConfigurator";
import StudioHome from "@/pages/StudioHome";
import StandStudio from "@/components/studio/StandStudio";

// Route Guard Wrapper (Simplified for this generation)
// Ideally, use a proper AuthGuard component that checks role

function Router() {
  return (
    <Switch>
      {/* Redirect root to Studio */}
      <Route path="/">
        {() => <Redirect to="/studio" />}
      </Route>

      {/* Stand Studio - Route principale */}
      <Route path="/studio" component={StandStudio} />
      <Route path="/studio/home" component={StudioHome} />

      {/* Old routes */}
      <Route path="/home" component={Home} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />

      {/* Organizer Routes */}
      <Route path="/organizer" component={Dashboard} />

      {/* Exhibitor Routes */}
      <Route path="/exhibitor">
        <div className="flex items-center justify-center min-h-screen">
          Exhibitor Dashboard Placeholder (Try /exhibitor/booth/1)
        </div>
      </Route>
      <Route path="/exhibitor/booth/:id" component={BoothConfigurator} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
