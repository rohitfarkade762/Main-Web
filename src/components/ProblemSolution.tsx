import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

const ProblemSolution = () => {
  const problems = [
    "Imprecise R and XL circuit configurations",
    "Extended test times due to manual setup",
    "High safety risks during 10,000A fault generation",
    "Poor test accuracy and repeatability",
    "Increased personnel exposure to hazards",
  ];

  const solutions = [
    "Automated precision R/XL configuration",
    "90% reduction in test cycle time",
    "Remote operation with safety interlocks",
    "±0.1% measurement accuracy",
    "Zero-contact testing protocol",
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Transforming MCB Testing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From manual hazards to automated precision
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-stretch">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-8 border border-destructive/20 shadow-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Current Challenges</h3>
                <p className="text-sm text-muted-foreground">Manual Testing Methods</p>
              </div>
            </div>

            <ul className="space-y-4">
              {problems.map((problem, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                  </span>
                  <span className="text-muted-foreground">{problem}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Arrow (hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-center -mx-8">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-16 h-16 rounded-full bg-gradient-electric flex items-center justify-center shadow-glow"
            >
              <ArrowRight className="w-8 h-8 text-foreground" />
            </motion.div>
          </div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-8 border border-electric/20 shadow-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-electric" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Our Solution</h3>
                <p className="text-sm text-muted-foreground">MCB TestPro System</p>
              </div>
            </div>

            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-electric/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-electric" />
                  </span>
                  <span className="text-foreground font-medium">{solution}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
