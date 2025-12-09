import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const AnimatedCounter = ({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-mono font-bold text-4xl sm:text-5xl text-electric">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const Specifications = () => {
  const specs = [
    { value: 10000, suffix: "A", label: "Maximum Test Current", description: "Short-circuit current capacity" },
    { value: 400, suffix: "V", label: "Operating Voltage", description: "AC voltage range 230-400V" },
    { value: 99.9, suffix: "%", label: "Measurement Accuracy", description: "Precision current measurement" },
    { value: 5, prefix: "<", suffix: "ms", label: "Response Time", description: "Fault detection latency" },
  ];

  const technicalSpecs = [
    { label: "Power Factor", value: "0.25 - 0.95 adjustable" },
    { label: "Test Duration", value: "0.01s - 10s programmable" },
    { label: "R/XL Ratio", value: "0.1 - 10 configurable" },
    { label: "Operating Temp", value: "-10°C to +45°C" },
    { label: "Data Interface", value: "RS-485, Ethernet, USB" },
    { label: "Standards", value: "IEC 60898-1:2015" },
    { label: "Dimensions", value: "2400 × 1200 × 2100 mm" },
    { label: "Weight", value: "~2500 kg" },
  ];

  return (
    <section id="specifications" className="py-24 bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-electric/20 text-electric text-sm font-medium mb-4">
            Technical Data
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            System Specifications
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Precision-engineered for demanding industrial testing environments
          </p>
        </motion.div>

        {/* Animated Counters */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {specs.map((spec, index) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10"
            >
              <AnimatedCounter value={spec.value} suffix={spec.suffix} prefix={spec.prefix} />
              <div className="mt-3 font-semibold text-primary-foreground">{spec.label}</div>
              <div className="text-sm text-primary-foreground/60">{spec.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Specs Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary-foreground/5 rounded-2xl p-8 border border-primary-foreground/10"
        >
          <h3 className="text-xl font-bold mb-6">Detailed Specifications</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {technicalSpecs.map((spec, index) => (
              <div key={spec.label} className="p-4 rounded-lg bg-primary-foreground/5">
                <div className="text-sm text-primary-foreground/60 mb-1">{spec.label}</div>
                <div className="font-mono font-semibold text-electric">{spec.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Specifications;
