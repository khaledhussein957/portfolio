import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/AuthStore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordPage() {
  const { isLoading, forgotPassword } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    await forgotPassword(data.email);
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
            <CardTitle className="text-2xl text-black dark:text-white">Forgot password</CardTitle>
            <CardDescription className="text-black dark:text-white">
              Enter your email below to reset your password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 dark:text-red-400 text-xs">{errors.email.message}</span>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-black dark:bg-white text-white dark:text-black border-black dark:border-white border" type="submit">
                {isLoading ? "Loading..." : "Send Reset Link"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPage;
