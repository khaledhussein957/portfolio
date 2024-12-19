import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useAuthStore } from "@/stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LoginPage() {

  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

  const navigate = useNavigate();

	const { login, isLoading, error } = useAuthStore();

	const handleLogin = async (e) => {
    e.preventDefault();

		await login(email, password);
    navigate("/");
	};

  return (
    // add some width to the Card when is desktop and pc
    <motion.div
    initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            Github
          </Button>
          <Button variant="outline">
            
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="........" onChange={(e) => setPassword(e.target.value)} />
        </div>
      </CardContent>
      {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}
      <CardFooter>
        <Button className="w-full" onClick={handleLogin}>{isLoading ? "Loading..." : "Login"}</Button>
      </CardFooter>
      {/* add space between both p tag */}
      <p className="mt-4 text-center">
        I don't have an account! <a href="/signup">Signup</a>
      </p>
      <p className="mt-4 pb-4 text-center">
        Forget Password? <a href="/forgot-password">Forget Password</a>
      </p>
    </Card>
    </motion.div>
  )
}

export default LoginPage;