import { motion } from "framer-motion";
import { Shield, Lock, Eye, AlertCircle, Radio, FileCheck } from "lucide-react";

const Safety = () => {
  const safetyFeatures = [
    {
      icon: Lock,
      title: "Physical Interlocks",
      description: "Multiple mechanical safety barriers prevent access during high-current operation.",
    },
    {
      icon: Eye,
      title: "Remote Monitoring",
      description: "Full system visibility via secure network interface for off-site operation.",
    },
    {
      icon: AlertCircle,
      title: "Emergency Stop",
      description: "Multiple E-stop locations with fail-safe circuit interruption under 1ms.",
    },
    {
      icon: Radio,
      title: "Wireless Control",
      description: "Operate from a safe distance with encrypted wireless control interface.",
    },
  ];

  const certifications = [
    { name: "IEC 60898-1:2015", description: "Circuit-breaker testing standard" },
    { name: "ISO 9001:2015", description: "Quality management certified" },
    { name: "CE Marking", description: "European conformity" },
    { name: "UL Listed", description: "North American safety" },
  ];

  return (
    <section id="safety" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-electric/10 text-electric text-sm font-medium mb-4">
              Safety First
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Uncompromising Safety Standards
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our system prioritizes operator safety with multiple redundant protection 
              systems, ensuring zero-contact testing during high-energy fault generation.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {safetyFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card rounded-3xl p-8 border border-border shadow-elevated">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-electric flex items-center justify-center shadow-glow">
                  <Shield className="w-7 h-7 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Certifications</h3>
                  <p className="text-sm text-muted-foreground">Industry-recognized compliance</p>
                </div>
              </div>

              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200"
                  >
                    <FileCheck className="w-5 h-5 text-electric flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">{cert.name}</div>
                      <div className="text-sm text-muted-foreground">{cert.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-electric/10 border border-electric/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-electric flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    All systems undergo rigorous factory acceptance testing (FAT) and 
                    site acceptance testing (SAT) before deployment.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Safety;
