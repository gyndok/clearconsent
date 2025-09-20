import { PregnancyWheelCalculator } from "@/components/pregnancy/pregnancy-wheel-calculator"

export default function PregnancyWheelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pregnancy wheel</h1>
        <p className="text-muted-foreground">
          Generate due dates, gestational age, and prenatal planning milestones from multiple clinical inputs.
        </p>
      </div>
      <PregnancyWheelCalculator />
    </div>
  )
}
