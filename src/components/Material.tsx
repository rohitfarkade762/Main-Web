import { Package } from "lucide-react";
import AuthForm from "./auth/AuthForm";

const Material = () => {
  return (
    <AuthForm
      title="Material Portal"
      description="Inventory and materials management"
      icon={<Package className="w-8 h-8 text-primary-foreground" />}
      colorClass="bg-dept-material"
      type="department"
      departmentName="Material"
    />
  );
};

export default Material;
