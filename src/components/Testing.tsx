import { FlaskConical } from "lucide-react";
import AuthForm from "./auth/AuthForm";

const Testing = () => {
  return (
    <AuthForm
      title="Testing Portal"
      description="Quality assurance testing access"
      icon={<FlaskConical className="w-8 h-8 text-primary-foreground" />}
      colorClass="bg-dept-testing"
      type="department"
      departmentName="Testing"
    />
  );
};

export default Testing;
