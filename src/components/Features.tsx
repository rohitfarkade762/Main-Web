import { motion } from "framer-motion";
import { 
  Cpu, 
  Shield, 
  Gauge, 
  RefreshCcw, 
  Settings2, 
  FileCheck 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Cpu,
      title: "Automated R/XL Configuration",
      description: "Precision resistive and inductive circuit setup with automatic calibration for accurate impedance matching.",
    },
    {
      icon: Gauge,
      title: "High-Current Generation",
      description: "Generate fault currents up to 10,000A with stable waveform characteristics meeting IEC standards.",
    },
    {
      icon: Shield,
      title: "Safety Interlocks",
      description: "Multi-level protection systems including physical barriers, emergency stops, and remote operation capability.",
    },
    {
      icon: RefreshCcw,
      title: "Rapid Test Cycles",
      description: "Complete test sequences in minutes with automated DUT positioning and result logging.",
    },
    {
      icon: Settings2,
      title: "Flexible Test Parameters",
      description: "Customizable voltage, current, and timing parameters for comprehensive MCB characterization.",
    },
    {
      icon: FileCheck,
      title: "Compliance Reporting",
      description: "Automatic generation of IEC 60898-1:2015 compliant test reports with full traceability.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-electric/10 text-electric text-sm font-medium mb-4">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Industry-Leading Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Engineered for precision, safety, and compliance with international standards
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-electric/30 shadow-card hover:shadow-elevated transition-all duration-300"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-electric/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-electric/10 flex items-center justify-center mb-6 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-electric transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
