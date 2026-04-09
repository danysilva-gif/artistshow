import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Battles from "./pages/Battles";
import BattleRoom from "./pages/BattleRoom";
import Voting from "./pages/Voting";
import Leaderboard from "./pages/Leaderboard";
import ThemeReveal from "./pages/ThemeReveal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/battles" element={<Battles />} />
          <Route path="/battle/:id" element={<BattleRoom />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/voting/:battleId" element={<Voting />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/themes" element={<ThemeReveal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
