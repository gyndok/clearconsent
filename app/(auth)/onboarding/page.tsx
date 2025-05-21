"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [jobTitleError, setJobTitleError] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset errors
    setJobTitleError("");
    setCompanyNameError("");

    let isValid = true;

    if (!jobTitle) {
      setJobTitleError("Job title is required.");
      isValid = false;
    }

    if (!companyName) {
      setCompanyNameError("Company name is required.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Mock onboarding data submission
    console.log("Job Title:", jobTitle);
    console.log("Company Name:", companyName);

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome!</CardTitle>
          <CardDescription className="text-center">
            Let's get your profile set up. Please tell us a bit about your role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                type="text"
                placeholder="e.g., Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className={jobTitleError ? "border-red-500" : ""}
              />
              {jobTitleError && <p className="text-xs text-red-500">{jobTitleError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="e.g., Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className={companyNameError ? "border-red-500" : ""}
              />
              {companyNameError && <p className="text-xs text-red-500">{companyNameError}</p>}
            </div>
            <Button type="submit" className="w-full">
              Complete Onboarding
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center text-gray-500 dark:text-gray-400">
          <p>This information helps us personalize your experience.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
