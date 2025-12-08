import { Wrench } from "lucide-react";
import AuthForm from "./auth/AuthForm";

const Assembly = () => {
  return (
    <AuthForm
      title="Assembly Portal"
      description="Production assembly management"
      icon={<Wrench className="w-8 h-8 text-primary-foreground" />}
      colorClass="bg-dept-assembly"
      type="department"
      departmentName="Assembly"
    />
  );
};

export default Assembly;
