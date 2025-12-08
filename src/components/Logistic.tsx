import { Truck } from "lucide-react";
import AuthForm from "./auth/AuthForm";

const Logistic = () => {
  return (
    <AuthForm
      title="Logistic Portal"
      description="Supply chain management access"
      icon={<Truck className="w-8 h-8 text-primary-foreground" />}
      colorClass="bg-dept-logistic"
      type="department"
      departmentName="Logistic"
    />
  );
};

export default Logistic;
