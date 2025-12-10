import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/ui/button";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-electric/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-electric/10 text-electric text-sm font-medium mb-4">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Modernize Your{" "}
            <span className="text-gradient-electric">MCB Testing?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Contact our engineering team for a personalized demonstration and 
            discover how our automated system can transform your testing capabilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" onClick={() => navigate("/options")}>
            Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="navyOutline" size="xl">
              Download Brochure
            </Button>
          </div>

          {/* Contact Info */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Mail, label: "Email", value: "sales@mcbtestpro.com" },
              { icon: Phone, label: "Phone", value: "+91 1800 123 4567" },
              { icon: MapPin, label: "Location", value: "Bangalore, India" },
            ].map((contact, index) => (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center mb-4">
                  <contact.icon className="w-6 h-6 text-electric" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">{contact.label}</div>
                <div className="font-semibold text-foreground">{contact.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
