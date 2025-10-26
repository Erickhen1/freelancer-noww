import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import JobSearch from "./pages/JobSearch";
import PostJob from "./pages/PostJob";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import JobDetail from "@/pages/JobDetail";
import EditJob from "@/pages/EditJob";
import Terms from "./pages/Terms";
import About from "./pages/About";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/buscar-vagas" component={JobSearch} />
      <Route path="/publicar-vaga" component={PostJob} />
      <Route path="/perfil" component={Profile} />
      <Route path="/avaliacoes" component={Reviews} />
      <Route path="/mensagens" component={Messages} />
      <Route path="/chat/:id" component={Chat} />
      <Route path="/vaga/:id" component={JobDetail} />
      <Route path="/editar-vaga/:id" component={EditJob} />
      <Route path="/termos" component={Terms} />
      <Route path="/sobre" component={About} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Navbar />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

