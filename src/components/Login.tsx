import { LogIn } from "lucide-react";
import AuthForm from "./auth/AuthForm";

const Login = () => {
  return (
    <AuthForm
      title="Sign In"
      description="Access your account"
      icon={<LogIn className="w-8 h-8 text-primary-foreground" />}
      colorClass="bg-gradient-hero"
      type="login"
    />
  );
};

export default Login;
