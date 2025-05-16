"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - would be replaced with real data from API
const procedureCategories = [
  { name: "Orthopedic", count: 42 },
  { name: "Cardiac", count: 28 },
  { name: "Neurological", count: 23 },
  { name: "Gastrointestinal", count: 35 },
  { name: "Dermatological", count: 19 },
  { name: "Other", count: 15 },
]

const completionTime = [
  { name: "Same Day", count: 32 },
  { name: "1-2 Days", count: 45 },
  { name: "3-5 Days", count: 28 },
  { name: "6-10 Days", count: 15 },
  { name: "10+ Days", count: 8 },
]

const viewDuration = [
  { name: "Video", minutes: 8.5 },
  { name: "PDF", minutes: 12.3 },
  { name: "Text", minutes: 5.7 },
  { name: "Interactive", minutes: 15.2 },
]

export function ProcedureAnalytics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Procedure Categories</CardTitle>
          <CardDescription>Distribution of procedures by medical category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Procedures",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={procedureCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Time</CardTitle>
          <CardDescription>Time taken by patients to complete procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Procedures",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionTime} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Content Engagement</CardTitle>
          <CardDescription>Average time spent on different content types</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              minutes: {
                label: "Minutes",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewDuration}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="minutes" fill="var(--color-minutes)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
