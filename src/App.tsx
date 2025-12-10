import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Index";
import Options from "./pages/Options";
import Dashboard2 from "./pages/Dashboard";
import Dashboard from "./pages/IndexDashboard";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Assembly from "./components/Assembly";
import Climate from "./components/Climate";
import Form from "./components/Form";
import Logistic from "./components/Logistic";
import Material from "./components/Material";
import Testing from "./components/Testing";
import NotFound from "./pages/NotFound";
import AllLogs from "@/pages/AllLogs";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
        <Route path="/logs" element={<AllLogs />} />
          <Route path="/" element={<Landing />} />
          <Route path="/options" element={<Options />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/assembly" element={<Assembly />} />
          <Route path="/climate" element={<Climate />} />
          <Route path="/form" element={<Form />} />
          <Route path="/logistic" element={<Logistic />} />
          <Route path="/material" element={<Material />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
