
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Partners from "./pages/Partners";
import Needs from "./pages/Needs";
import ResourceMap from "./pages/ResourceMap";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import Offers from "./pages/Offers";
import Map from "./pages/Map";
import About from "./pages/About";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import { StrictMode } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Matches from "./pages/Matches";
import { WebSocketProvider } from "./context/WebSocketContext";

const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WebSocketProvider>
          <BrowserRouter>
          <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/needs" element={<Needs />} />
              <Route path="/resources" element={<ResourceMap />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/map" element={<Map />} />
              <Route path="/about" element={<About />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/matches" element={<Matches />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          {/* Place toast components inside the component tree */}
          <Toaster />
          <Sonner />
          </WebSocketProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
