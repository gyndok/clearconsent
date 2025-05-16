import { redirect } from "next/navigation"

export default function HomePage() {
  // In a real app, we would check if the user is authenticated
  // and redirect accordingly
  redirect("/login")
}
