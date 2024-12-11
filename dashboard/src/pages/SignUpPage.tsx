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
// import { github } from "lucide-react"


function SignUpPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

  const navigate = useNavigate();

	const { signup, isLoading, error } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(email, password);
    navigate("/login");
	};

  return (
    // add some width to the Card when is desktop and pc
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
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
          <Label htmlFor="name">Email</Label>
          <Input id="name" type="text" placeholder="john doe" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} >{isLoading ? "Loading..." : "Create account"}</Button>
      </CardFooter>
      <p className="flex flex-col space-y-1.5 p-6 text-center">Already have an account? <a href="/login">Login</a></p>
    </Card>
  )
}

export default SignUpPage;