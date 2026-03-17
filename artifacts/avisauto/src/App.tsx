import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedLayout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Reviews from "@/pages/reviews";
import AiResponses from "@/pages/ai-responses";
import Templates from "@/pages/templates";
import Statistics from "@/pages/statistics";
import Settings from "@/pages/settings";
import AdminDashboard from "@/pages/admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/">
        {() => {
          // Default redirect
          window.location.href = "/dashboard";
          return null;
        }}
      </Route>

      <Route path="/:rest*">
        <ProtectedLayout>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/avis" component={Reviews} />
            <Route path="/reponses-ia" component={AiResponses} />
            <Route path="/modeles" component={Templates} />
            <Route path="/stats" component={Statistics} />
            <Route path="/parametres" component={Settings} />
            <Route path="/admin" component={AdminDashboard} />
            <Route component={NotFound} />
          </Switch>
        </ProtectedLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="avisauto-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
