import { ShieldCheck } from "lucide-react";
import AuthForm from "./auth/AuthForm";

const Admin = () => {
  return (
    <AuthForm
      title="Admin Portal"
      description="System administration access"
      icon={<ShieldCheck className="w-8 h-8 text-primary-foreground" />}
      colorClass="bg-dept-admin"
      type="department"
      departmentName="Admin"
    />
  );
};

export default Admin;
