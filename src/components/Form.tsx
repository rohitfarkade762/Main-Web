import { FileText } from "lucide-react";
import AuthForm from "./auth/AuthForm";

const Form = () => {
  return (
    <AuthForm
      title="Form Portal"
      description="Document and form processing"
      icon={<FileText className="w-8 h-8 text-primary-foreground" />}
      colorClass="bg-dept-form"
      type="department"
      departmentName="Form"
    />
  );
};

export default Form;
