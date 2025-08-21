import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/AuthStore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const handleLogin = async (data: LoginForm) => {
    await login(data.email, data.password);
    navigate("/admin");
  };

  return (
  <div className="min-h-screen w-full bg-white dark:bg-black flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4"
      >
  <Card className="w-full sm:max-w-md mx-auto bg-white dark:bg-black shadow-lg dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.15)] text-black dark:text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-black dark:text-white">Login</CardTitle>
            <CardDescription className="text-black dark:text-white">
              Enter your email below to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(handleLogin)}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 dark:text-red-400 text-xs">{errors.email.message}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-black dark:text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-500 dark:text-red-400 text-xs">{errors.password.message}</span>
                )}
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="underline text-black dark:text-white text-sm"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>

            {error && (
              <p className="text-red-500 dark:text-red-400 font-semibold text-sm px-6 -mt-2">
                {error}
              </p>
            )}

            <CardFooter>
              <Button className="w-full bg-black dark:bg-white text-white dark:text-black border-black dark:border-white border" type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </CardFooter>
          </form>

          <div className="text-sm text-center mt-4 space-y-2 pb-4 text-black dark:text-white">
            <p>
              I don't have an account?{" "}
              <Link to="/signup" className="underline text-black dark:text-white">
                Signup
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default LoginPage;
