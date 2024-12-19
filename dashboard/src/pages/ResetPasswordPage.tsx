import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/AuthStore";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetPassword, isLoading } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPassword(token, password);
    navigate("/login");
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create New Password</CardTitle>
          <CardDescription>Enter the new password below</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="Password">Password</Label>
            <Input
              id="Password"
              type="ypassword"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Password">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>
            {isLoading ? "Loading..." : "Create a new Password"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default ResetPasswordPage;
