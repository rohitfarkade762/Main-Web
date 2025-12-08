import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Wrench, 
  Thermometer, 
  FileText, 
  Truck, 
  Package, 
  FlaskConical 
} from "lucide-react";

interface OptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  path: string;
  delay: string;
}

const OptionCard = ({ title, description, icon, colorClass, path, delay }: OptionCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      onClick={() => navigate(path)}
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card animate-slide-up opacity-0 ${delay}`}
    >
      <CardHeader className="pb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${colorClass}`}>
          {icon}
        </div>
        <CardTitle className="text-lg font-display">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
          <span>Access portal</span>
          <ArrowLeft className="w-4 h-4 ml-1 rotate-180 transition-transform group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );
};

const options = [
  {
    title: "Sign Up",
    description: "Create a new account to get started",
    icon: <UserPlus className="w-6 h-6 text-primary-foreground" />,
    colorClass: "bg-primary",
    path: "/signup",
  },
  {
    title: "Sign In",
    description: "Access your existing account",
    icon: <LogIn className="w-6 h-6 text-primary-foreground" />,
    colorClass: "bg-gradient-hero",
    path: "/login",
  },
  {
    title: "Admin",
    description: "System administration panel",
    icon: <ShieldCheck className="w-6 h-6 text-primary-foreground" />,
    colorClass: "bg-dept-admin",
    path: "/admin",
  },
  {
    title: "Assembly",
    description: "Production assembly management",
    icon: <Wrench className="w-6 h-6 text-primary-foreground" />,
    colorClass: "bg-dept-assembly",
    path: "/assembly",
  },
  {
    title: "Climate",
    description: "Environmental monitoring",
    icon: <Thermometer className="w-6 h-6 text-primary-foreground" />,
    colorClass: "bg-dept-climate",
    path: "/climate",
  },
  {
    title: "Form",
    description: "Document and form processing",
    icon: <FileText className="w-6 h-6 text-primary-foreground" />,
    colorClass: "bg-dept-form",
    path: "/form",
  },
  {
    title: "Logistic",
    description: "Supply chain management",
    icon: <Truck className="w-6 h-6 text-primary-foreground" />,
    colorClass: "bg-dept-logistic",
    path: "/logistic",
  },
  {
    title: "Material",
    description: "Inventory and materials",
    icon: <Package className="w-6 h-6 text-primary-foreground" />,
    colorClass: "bg-dept-material",
    path: "/material",
  },
  {
    title: "Testing",
    description: "Quality assurance testing",
    icon: <FlaskConical className="w-6 h-6 text-primary-foreground" />,
    colorClass: "bg-dept-testing",
    path: "/testing",
  },
];

const Options = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in opacity-0">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Choose Your Portal
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Select your department or action to continue. Each portal is tailored to your specific needs.
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <OptionCard
              key={option.title}
              {...option}
              delay={`stagger-${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Options;
