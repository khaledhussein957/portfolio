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

const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[^\d]+$/, "Name cannot contain numbers"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

function SignUpPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignUpForm) => {
    await signup(data.name, data.email, data.password);
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-sm mx-auto bg-white dark:bg-black shadow-lg dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.15)] text-black dark:text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-black dark:text-white">
              Create an account
            </CardTitle>
            <CardDescription className="text-black dark:text-white">
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-black dark:text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-red-500 dark:text-red-400 text-xs">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 dark:text-red-400 text-xs">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="text-black dark:text-white"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-500 dark:text-red-400 text-xs">
                    {errors.password.message}
                  </span>
                )}
              </div>
              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {error}
                </p>
              )}
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black border-black dark:border-white border"
              >
                {isLoading ? "Loading..." : "Create account"}
              </Button>
            </CardFooter>
          </form>

          <p className="flex flex-col space-y-1.5 p-6 text-center text-sm text-black dark:text-white">
            Already have an account?{" "}
            <Link to="/login" className="underline text-black dark:text-white">
              Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

export default SignUpPage;
