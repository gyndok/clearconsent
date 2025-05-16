import type React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  title: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
  children?: React.ReactNode
}

export function Breadcrumb({ items, className, children }: BreadcrumbProps) {
  // If children are provided, render them directly
  if (children) {
    return (
      <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground", className)}>
        {children}
      </nav>
    )
  }

  // Otherwise, render based on items prop
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center hover:text-primary transition-colors"
            aria-label="Dashboard"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items?.map((item, index) => (
          <li key={item.href} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            {index === items.length - 1 ? (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export const BreadcrumbList = ({ children }: { children: React.ReactNode }) => {
  return <ol className="flex items-center space-x-2">{children}</ol>
}

export const BreadcrumbItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="flex items-center space-x-2">{children}</li>
}

export const BreadcrumbLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} className="hover:text-primary transition-colors">
      {children}
    </Link>
  )
}

export const BreadcrumbPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="font-medium text-foreground" aria-current="page">
      {children}
    </span>
  )
}

export const BreadcrumbSeparator = () => {
  return <ChevronRight className="h-4 w-4" />
}

export const BreadcrumbEllipsis = () => {
  return <span>...</span>
}
