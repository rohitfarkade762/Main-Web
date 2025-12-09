import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-electric/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric/10 border border-electric/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-electric animate-pulse" />
              <span className="text-sm font-medium text-electric">IEC 60898-1:2015 Compliant</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Automated{" "}
              <span className="text-gradient-electric">High-Current</span>{" "}
              MCB Test System
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Revolutionary short-circuit breaking capacity testing up to 10,000A. 
              Precise R/XL configurations, enhanced safety protocols, and 
              unmatched repeatability for MCB certification.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button onClick={() => navigate("/options")} variant="hero" size="xl">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="navyOutline" size="xl">
                View Specifications
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Zap, value: "10,000A", label: "Max Current" },
                { icon: Clock, value: "< 5ms", label: "Response Time" },
                { icon: Shield, value: "99.9%", label: "Accuracy" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 text-electric mx-auto mb-2" />
                  <div className="font-mono font-bold text-xl text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Card */}
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl shadow-elevated overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_hsl(187_100%_42%_/_0.15),_transparent_50%)]" />
                
                {/* Circuit Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 400">
                  <path d="M50 200 H150 V100 H250 V200 H350" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M50 250 H100 V300 H200 V250 H300 V350" stroke="white" strokeWidth="2" fill="none" />
                  <circle cx="150" cy="200" r="8" fill="currentColor" className="text-electric" />
                  <circle cx="250" cy="200" r="8" fill="currentColor" className="text-electric" />
                  <circle cx="200" cy="300" r="8" fill="currentColor" className="text-electric" />
                </svg>

                {/* Floating Metrics */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-8 bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                >
                  <div className="text-xs text-muted-foreground mb-1">Current Reading</div>
                  <div className="font-mono text-2xl font-bold text-electric">8,547 A</div>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-8 left-8 bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                >
                  <div className="text-xs text-muted-foreground mb-1">Test Status</div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-semibold text-foreground">PASSED</span>
                  </div>
                </motion.div>

                {/* Center Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full border-4 border-electric/50 flex items-center justify-center mb-4 glow-electric animate-pulse-glow">
                      <Zap className="w-16 h-16 text-electric" />
                    </div>
                    <div className="text-primary-foreground font-semibold">System Active</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
