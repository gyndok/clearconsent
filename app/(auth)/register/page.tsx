"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateEmail = (email: string) => {
    if (!email) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format.";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    // Add more complexity requirements if needed, e.g., uppercase, lowercase, numbers, symbols
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset errors
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!fullName) {
      setFullNameError("Full name is required.");
      isValid = false;
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      isValid = false;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Mock registration process
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Password:", password);

    // Redirect to onboarding page
    router.push("/onboarding");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Fill in the details below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={fullNameError ? "border-red-500" : ""}
              />
              {fullNameError && <p className="text-xs text-red-500">{fullNameError}</p>}
            </div>
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
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={confirmPasswordError ? "border-red-500" : ""}
              />
              {confirmPasswordError && <p className="text-xs text-red-500">{confirmPasswordError}</p>}
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center">
           <p>Already have an account? <a href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Login</a></p>
        </CardFooter>
      </Card>
    </div>
  );
}
