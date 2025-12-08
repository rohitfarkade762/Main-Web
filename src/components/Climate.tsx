import { Thermometer } from "lucide-react";
import AuthForm from "./auth/AuthForm";

const Climate = () => {
  return (
    <AuthForm
      title="Climate Portal"
      description="Environmental monitoring access"
      icon={<Thermometer className="w-8 h-8 text-primary-foreground" />}
      colorClass="bg-dept-climate"
      type="department"
      departmentName="Climate"
    />
  );
};

export default Climate;
