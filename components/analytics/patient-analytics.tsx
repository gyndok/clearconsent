"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - would be replaced with real data from API
const ageDistribution = [
  { name: "18-24", value: 15 },
  { name: "25-34", value: 28 },
  { name: "35-44", value: 32 },
  { name: "45-54", value: 24 },
  { name: "55-64", value: 18 },
  { name: "65+", value: 10 },
]

const genderDistribution = [
  { name: "Male", value: 45, color: "#3b82f6" },
  { name: "Female", value: 52, color: "#ec4899" },
  { name: "Other", value: 3, color: "#8b5cf6" },
]

const patientActivity = [
  { name: "Mon", logins: 24, views: 42, completions: 18 },
  { name: "Tue", logins: 32, views: 58, completions: 24 },
  { name: "Wed", logins: 38, views: 65, completions: 30 },
  { name: "Thu", logins: 30, views: 52, completions: 26 },
  { name: "Fri", logins: 26, views: 45, completions: 22 },
  { name: "Sat", logins: 18, views: 30, completions: 14 },
  { name: "Sun", logins: 12, views: 25, completions: 10 },
]

const COLORS = ["#3b82f6", "#ec4899", "#8b5cf6"]

export function PatientAnalytics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Patient Activity by Day</CardTitle>
          <CardDescription>Login frequency, content views, and procedure completions</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              logins: {
                label: "Logins",
                color: "hsl(var(--chart-1))",
              },
              views: {
                label: "Content Views",
                color: "hsl(var(--chart-2))",
              },
              completions: {
                label: "Completions",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="logins" fill="var(--color-logins)" />
                <Bar dataKey="views" fill="var(--color-views)" />
                <Bar dataKey="completions" fill="var(--color-completions)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
          <CardDescription>Patient demographics by age group</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Patients",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
          <CardDescription>Patient demographics by gender</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
