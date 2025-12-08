import { UserPlus } from "lucide-react";
import AuthForm from "./auth/AuthForm";

const Signup = () => {
  return (
    <AuthForm
      title="Create Account"
      description="Sign up to access the Industrial Portal"
      icon={<UserPlus className="w-8 h-8 text-primary-foreground" />}
      colorClass="bg-primary"
      type="signup"
    />
  );
};

export default Signup;
