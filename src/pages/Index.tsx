import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Features from "@/components/Features";
import Specifications from "@/components/Specifications";
import DataVisualization from "@/components/DataVisualization";
import Safety from "@/components/Safety";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>MCB TestPro | Automated High-Current Short-Circuit Test System</title>
        <meta 
          name="description" 
          content="IEC 60898-1:2015 compliant automated MCB testing system. Precision short-circuit breaking capacity tests up to 10,000A with enhanced safety protocols." 
        />
        <meta property="og:title" content="MCB TestPro | Automated High-Current Short-Circuit Test System" />
        <meta property="og:description" content="Revolutionary automated testing for miniature circuit breakers. Precision, safety, and IEC compliance." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <ProblemSolution />
          <Features />
          <Specifications />
          <DataVisualization />
          <Safety />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
