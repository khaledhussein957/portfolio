import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/AuthStore";
import { useState } from "react";


function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
	};

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Forgot password</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
      <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>{isLoading ? "Loading..." : "Send Reset Link"}</Button>
      </CardFooter>
    </Card>
  )
}

export default ForgotPasswordPage
