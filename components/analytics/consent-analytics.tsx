"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - would be replaced with real data from API
const consentTrend = [
  { name: "Jan", rate: 68 },
  { name: "Feb", rate: 72 },
  { name: "Mar", rate: 75 },
  { name: "Apr", rate: 73 },
  { name: "May", rate: 78 },
  { name: "Jun", rate: 82 },
]

const consentByAge = [
  { name: "18-24", rate: 65 },
  { name: "25-34", rate: 72 },
  { name: "35-44", rate: 80 },
  { name: "45-54", rate: 78 },
  { name: "55-64", rate: 75 },
  { name: "65+", rate: 68 },
]

const dropoffPoints = [
  { name: "Invitation", percent: 100 },
  { name: "Registration", percent: 85 },
  { name: "Video View", percent: 72 },
  { name: "Document View", percent: 65 },
  { name: "Questions", percent: 60 },
  { name: "Signature", percent: 55 },
  { name: "Completion", percent: 52 },
]

export function ConsentAnalytics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Consent Rate Trend</CardTitle>
          <CardDescription>Monthly consent completion rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              rate: {
                label: "Consent Rate (%)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consent by Age Group</CardTitle>
          <CardDescription>Consent rates across different age demographics</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              rate: {
                label: "Consent Rate (%)",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consentByAge}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="rate" fill="var(--color-rate)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Consent Funnel</CardTitle>
          <CardDescription>Patient drop-off points in the consent process</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              percent: {
                label: "Completion Percentage",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dropoffPoints}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="percent"
                  stroke="var(--color-percent)"
                  fill="var(--color-percent)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
