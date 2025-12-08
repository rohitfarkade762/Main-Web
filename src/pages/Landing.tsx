import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Cog } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Brand */}
        <div className="animate-fade-in opacity-0 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <Cog className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Industrial Portal
            </h1>
          </div>
          <p className="text-muted-foreground text-center">Enterprise Management System</p>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto animate-slide-up opacity-0 stagger-1">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
            Streamline Your
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Operations
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Access all your department tools in one unified platform.
            Secure, efficient, and designed for modern enterprises.
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-scale-in opacity-0 stagger-2">
          <Button
            onClick={() => navigate("/options")}
            size="lg"
            className="group h-14 px-8 text-lg font-semibold bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-glow"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-16 animate-fade-in opacity-0 stagger-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-medium">Secure Access</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-medium">Multi-Department</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
            <Cog className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-medium">Real-time Sync</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 Industrial Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
