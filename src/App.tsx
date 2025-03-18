
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import WhatIsDyslexia from "./pages/WhatIsDyslexia";
import HowTestsWork from "./pages/HowTestsWork";
import HandwritingAnalysis from "./pages/HandwritingAnalysis";
import Checklist from "./pages/Checklist";
import CognitiveTests from "./pages/CognitiveTests";
import Results from "./pages/Results";
import UserProfile from "./components/UserProfile";
import TestReport from "./components/TestReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/what-is-dyslexia" element={<WhatIsDyslexia />} />
              <Route path="/how-tests-work" element={<HowTestsWork />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/handwriting-analysis" element={<HandwritingAnalysis />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/cognitive-tests" element={<CognitiveTests />} />
              <Route path="/results" element={<Results />} />
              <Route path="/report" element={<TestReport />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
