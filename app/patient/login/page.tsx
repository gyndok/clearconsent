import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PatientLoginForm } from "@/components/patient/patient-login-form"

export const metadata: Metadata = {
  title: "Patient Login | ClearConsent",
  description: "Login to your ClearConsent patient account",
}

export default function PatientLoginPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-teal-900">
          <Image src="/caring-doctor.png" fill alt="Doctor caring for patient" className="object-cover opacity-20" />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          ClearConsent
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "ClearConsent has made understanding my medical procedures so much easier. The videos and information
              provided helped me feel confident about my treatment."
            </p>
            <footer className="text-sm">Sarah Johnson</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Patient Login</h1>
            <p className="text-sm text-muted-foreground">Enter your email and password to access your account</p>
          </div>
          <PatientLoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/patient/invitation" className="underline underline-offset-4 hover:text-primary">
              Use your invitation link
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
