"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required.";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Invalid email format.";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    // Mock login process
    console.log("Email:", email);
    console.log("Password:", password);

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && <p className="text-xs text-red-500">{emailError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center">
          <p>Don't have an account? <a href="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign up</a></p>
        </CardFooter>
      </Card>
    </div>
  );
}
