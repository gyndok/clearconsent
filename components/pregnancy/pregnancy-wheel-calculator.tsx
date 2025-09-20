"use client"

import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  addDays,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfDay,
} from "date-fns"
import { CalendarIcon, Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const PREGNANCY_LENGTH_DAYS = 280
const CONCEPTION_OFFSET_DAYS = 266

const milestoneConfig = [
  {
    label: "Confirm viability ultrasound",
    startWeek: 6,
    endWeek: 8,
    description: "Schedule an early ultrasound to confirm intrauterine pregnancy and fetal heart activity.",
  },
  {
    label: "Initial prenatal visit",
    startWeek: 8,
    endWeek: 10,
    description: "Complete intake labs, review medical history, and establish prenatal care plan.",
  },
  {
    label: "First trimester screening",
    startWeek: 11,
    endWeek: 13,
    description: "Offer nuchal translucency ultrasound and first trimester genetic screening.",
  },
  {
    label: "Maternal serum AFP",
    startWeek: 15,
    endWeek: 18,
    description: "Consider second-trimester serum screening for neural tube defects.",
  },
  {
    label: "Anatomy ultrasound",
    startWeek: 18,
    endWeek: 22,
    description: "Order detailed fetal anatomy scan and cervical length assessment.",
  },
  {
    label: "Glucose tolerance screening",
    startWeek: 24,
    endWeek: 28,
    description: "Screen for gestational diabetes using 1-hour glucose challenge or diagnostic testing.",
  },
  {
    label: "Rhogam for Rh-negative patients",
    startWeek: 28,
    endWeek: 28,
    description: "Administer anti-D immune globulin if the birthing parent is Rh-negative.",
  },
  {
    label: "Tdap immunization",
    startWeek: 27,
    endWeek: 36,
    description: "Offer Tdap vaccination to optimize passive immunity for the newborn.",
  },
  {
    label: "Growth assessment / presentation",
    startWeek: 32,
    endWeek: 34,
    description: "Assess fetal growth, position, and amniotic fluid as indicated.",
  },
  {
    label: "Group B strep culture",
    startWeek: 36,
    endWeek: 37,
    description: "Collect vaginal/rectal swab for Group B streptococcus screening.",
  },
  {
    label: "Weekly visits & delivery planning",
    startWeek: 37,
    endWeek: 39,
    description: "Initiate weekly prenatal visits, review birth preferences, and confirm delivery logistics.",
  },
  {
    label: "Estimated due date",
    startWeek: 40,
    endWeek: 40,
    description: "Anticipated delivery date if spontaneous labor has not occurred.",
  },
] as const

const tabs = [
  {
    value: "lmp",
    label: "Last menstrual period",
  },
  {
    value: "conception",
    label: "Conception",
  },
  {
    value: "ultrasound",
    label: "Ultrasound",
  },
  {
    value: "ivf",
    label: "IVF transfer",
  },
] as const

type CalculationMethod = (typeof tabs)[number]["value"]

type MilestoneWindow = {
  label: string
  startDate: Date
  endDate: Date
  weekRange: string
  description: string
  isCurrent: boolean
  isUpcoming: boolean
}

type TrimesterRange = {
  label: string
  startDate: Date
  endDate: Date
  weeksRange: string
}

type PregnancyResult = {
  method: CalculationMethod
  methodLabel: string
  detail: string
  dueDate: Date
  lmp: Date
  conceptionDate: Date
  gestationalWeeks: number
  gestationalDays: number
  daysRemaining: number
  postpartumDays: number
  progress: number
  currentTrimester: string
  milestoneWindows: MilestoneWindow[]
  trimesterRanges: TrimesterRange[]
  nextMilestone?: MilestoneWindow
}

const lmpSchema = z.object({
  lmp: z.date({
    required_error: "Select the first day of the last menstrual period.",
  }),
  cycleLength: z
    .coerce
    .number({
      required_error: "Enter the patient\"s average cycle length.",
    })
    .min(20, "Cycle length must be at least 20 days.")
    .max(45, "Cycle length must be 45 days or fewer."),
})

const conceptionSchema = z.object({
  conceptionDate: z.date({
    required_error: "Select the known date of conception or ovulation.",
  }),
})

const ultrasoundSchema = z.object({
  ultrasoundDate: z.date({
    required_error: "Select the date the ultrasound was performed.",
  }),
  gaWeeks: z
    .coerce
    .number({
      required_error: "Enter whole weeks of gestation.",
    })
    .min(4, "Gestational age must be at least 4 weeks.")
    .max(42, "Gestational age cannot exceed 42 weeks."),
  gaDays: z
    .coerce
    .number({
      required_error: "Enter additional days of gestation (0-6).",
    })
    .min(0, "Days must be 0 or greater.")
    .max(6, "Days must be 6 or fewer."),
})

const ivfSchema = z
  .object({
    transferDate: z.date({
      required_error: "Select the embryo transfer date.",
    }),
    embryoStage: z.enum(["day3", "day5", "day6", "custom"], {
      required_error: "Select the embryo stage at transfer.",
    }),
    customEmbryoAge: z
      .coerce
      .number()
      .min(1, "Embryo age must be at least 1 day.")
      .max(10, "Embryo age must be 10 days or fewer.")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.embryoStage === "custom" && (data.customEmbryoAge === undefined || Number.isNaN(data.customEmbryoAge))) {
      ctx.addIssue({
        path: ["customEmbryoAge"],
        code: z.ZodIssueCode.custom,
        message: "Enter the embryo age in days.",
      })
    }
  })

export function PregnancyWheelCalculator() {
  const [activeTab, setActiveTab] = useState<CalculationMethod>("lmp")
  const [result, setResult] = useState<PregnancyResult | null>(null)

  const lmpForm = useForm<z.infer<typeof lmpSchema>>({
    resolver: zodResolver(lmpSchema),
    defaultValues: {
      lmp: undefined,
      cycleLength: 28,
    },
  })

  const conceptionForm = useForm<z.infer<typeof conceptionSchema>>({
    resolver: zodResolver(conceptionSchema),
    defaultValues: {
      conceptionDate: undefined,
    },
  })

  const ultrasoundForm = useForm<z.infer<typeof ultrasoundSchema>>({
    resolver: zodResolver(ultrasoundSchema),
    defaultValues: {
      ultrasoundDate: undefined,
      gaWeeks: 8,
      gaDays: 0,
    },
  })

  const ivfForm = useForm<z.infer<typeof ivfSchema>>({
    resolver: zodResolver(ivfSchema),
    defaultValues: {
      transferDate: undefined,
      embryoStage: "day5",
      customEmbryoAge: undefined,
    },
  })

  const customEmbryoStageSelected = ivfForm.watch("embryoStage") === "custom"

  function handleResult(nextResult: PregnancyResult) {
    setResult(nextResult)
  }

  function handleLmpSubmit(values: z.infer<typeof lmpSchema>) {
    const dueDate = normalizeDate(
      addDays(values.lmp, PREGNANCY_LENGTH_DAYS + (values.cycleLength - 28))
    )
    handleResult(
      buildPregnancyResult({
        method: "lmp",
        methodLabel: "Last menstrual period",
        detail: `LMP recorded on ${format(values.lmp, "PPP")} with an average ${values.cycleLength}-day cycle.`,
        dueDate,
      })
    )
  }

  function handleConceptionSubmit(values: z.infer<typeof conceptionSchema>) {
    const dueDate = normalizeDate(addDays(values.conceptionDate, CONCEPTION_OFFSET_DAYS))
    handleResult(
      buildPregnancyResult({
        method: "conception",
        methodLabel: "Conception date",
        detail: `Conception/ovulation documented on ${format(values.conceptionDate, "PPP")}.`,
        dueDate,
      })
    )
  }

  function handleUltrasoundSubmit(values: z.infer<typeof ultrasoundSchema>) {
    const measuredDays = values.gaWeeks * 7 + values.gaDays
    const dueDate = normalizeDate(addDays(values.ultrasoundDate, PREGNANCY_LENGTH_DAYS - measuredDays))
    handleResult(
      buildPregnancyResult({
        method: "ultrasound",
        methodLabel: "Ultrasound dating",
        detail: `Ultrasound performed ${format(values.ultrasoundDate, "PPP")} measuring ${values.gaWeeks}w${values.gaDays}.`,
        dueDate,
      })
    )
  }

  function handleIvfSubmit(values: z.infer<typeof ivfSchema>) {
    const embryoAgeDays = getEmbryoAgeDays(values.embryoStage, values.customEmbryoAge)
    const dueDate = normalizeDate(addDays(values.transferDate, CONCEPTION_OFFSET_DAYS - embryoAgeDays))
    handleResult(
      buildPregnancyResult({
        method: "ivf",
        methodLabel: "IVF transfer",
        detail: `Embryo transfer on ${format(values.transferDate, "PPP")} with a day ${embryoAgeDays} embryo.`,
        dueDate,
      })
    )
  }

  const summaryCopy = useMemo(() => {
    if (!result) {
      return null
    }

    const today = startOfDay(new Date())

    if (result.postpartumDays > 0) {
      return `Pregnancy reached ${format(result.dueDate, "PPP")} and is now ${result.postpartumDays} day${
        result.postpartumDays === 1 ? "" : "s"
      } postpartum.`
    }

    if (result.daysRemaining <= 0) {
      return "Pregnancy is at or beyond the estimated due date."
    }

    const next = result.nextMilestone
    if (next) {
      return `Next key milestone: ${next.label} (${formatDateRange(next.startDate, next.endDate)}).`
    }

    if (isBefore(today, result.dueDate)) {
      return "Pregnancy is progressing toward the estimated due date."
    }

    return null
  }, [result])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pregnancy wheel</CardTitle>
        <CardDescription>
          Calculate the estimated due date, gestational age, and critical prenatal milestones using clinical reference
          points.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CalculationMethod)} className="space-y-6">
          <TabsList className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="lmp">
            <Form {...lmpForm}>
              <form onSubmit={lmpForm.handleSubmit(handleLmpSubmit)} className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={lmpForm.control}
                  name="lmp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last menstrual period</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => isAfter(date, new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={lmpForm.control}
                  name="cycleLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average cycle length (days)</FormLabel>
                      <FormControl>
                        <Input type="number" inputMode="numeric" min={20} max={45} step={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit">Calculate from LMP</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="conception">
            <Form {...conceptionForm}>
              <form onSubmit={conceptionForm.handleSubmit(handleConceptionSubmit)} className="grid gap-4 sm:max-w-md">
                <FormField
                  control={conceptionForm.control}
                  name="conceptionDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Conception or ovulation date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => isAfter(date, new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Calculate from conception</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="ultrasound">
            <Form {...ultrasoundForm}>
              <form onSubmit={ultrasoundForm.handleSubmit(handleUltrasoundSubmit)} className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={ultrasoundForm.control}
                  name="ultrasoundDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ultrasound date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => isAfter(date, new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={ultrasoundForm.control}
                    name="gaWeeks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weeks</FormLabel>
                        <FormControl>
                          <Input type="number" inputMode="numeric" min={4} max={42} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ultrasoundForm.control}
                    name="gaDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional days</FormLabel>
                        <FormControl>
                          <Input type="number" inputMode="numeric" min={0} max={6} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit">Calculate from ultrasound</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="ivf">
            <Form {...ivfForm}>
              <form onSubmit={ivfForm.handleSubmit(handleIvfSubmit)} className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={ivfForm.control}
                  name="transferDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Embryo transfer date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => isAfter(date, new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={ivfForm.control}
                  name="embryoStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Embryo stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="day3">Day 3 cleavage-stage</SelectItem>
                          <SelectItem value="day5">Day 5 blastocyst</SelectItem>
                          <SelectItem value="day6">Day 6 blastocyst</SelectItem>
                          <SelectItem value="custom">Custom embryo age</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {customEmbryoStageSelected && (
                  <FormField
                    control={ivfForm.control}
                    name="customEmbryoAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Embryo age in days</FormLabel>
                        <FormControl>
                          <Input type="number" inputMode="numeric" min={1} max={10} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit">Calculate from IVF transfer</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <Separator />

        {result ? (
          <div className="space-y-8">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Estimated due date</p>
                  <Badge variant="outline">{result.methodLabel}</Badge>
                </div>
                <p className="mt-3 text-2xl font-semibold">{format(result.dueDate, "PPP")}</p>
                <p className="mt-2 text-sm text-muted-foreground">{result.detail}</p>
              </div>
              <div className="rounded-lg border p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Gestational age today</p>
                  <Badge>{result.currentTrimester}</Badge>
                </div>
                <p className="text-2xl font-semibold">{result.gestationalWeeks}w{result.gestationalDays}</p>
                <div>
                  <Progress value={result.progress} />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result.daysRemaining > 0
                      ? `${result.daysRemaining} day${result.daysRemaining === 1 ? "" : "s"} remaining until the due date.`
                      : result.postpartumDays > 0
                        ? `${result.postpartumDays} day${result.postpartumDays === 1 ? "" : "s"} since the estimated due date.`
                        : "At the estimated due date."}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border p-5 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Reference dates</p>
                <div>
                  <p className="text-sm text-muted-foreground">Calculated LMP</p>
                  <p className="text-lg font-semibold">{format(result.lmp, "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated conception</p>
                  <p className="text-lg font-semibold">{format(result.conceptionDate, "PPP")}</p>
                </div>
              </div>
            </div>

            {summaryCopy && (
              <div className="flex items-start gap-3 rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4" />
                <p>{summaryCopy}</p>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-muted">
                <CardHeader>
                  <CardTitle className="text-xl">Trimester overview</CardTitle>
                  <CardDescription>Key trimester boundaries based on the calculated gestational age.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trimester</TableHead>
                        <TableHead>Calendar dates</TableHead>
                        <TableHead>Gestational weeks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.trimesterRanges.map((range) => (
                        <TableRow key={range.label}>
                          <TableCell className="font-medium">{range.label}</TableCell>
                          <TableCell>{formatDateRange(range.startDate, range.endDate)}</TableCell>
                          <TableCell>{range.weeksRange}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardHeader>
                  <CardTitle className="text-xl">Milestone schedule</CardTitle>
                  <CardDescription>
                    Time-sensitive clinical checkpoints derived from the pregnancy wheel.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Milestone</TableHead>
                        <TableHead>Window</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.milestoneWindows.map((milestone) => (
                        <TableRow
                          key={milestone.label}
                          className={cn(
                            milestone.isCurrent ? "bg-muted/40" : "",
                            !milestone.isCurrent && milestone.isUpcoming ? "bg-muted/20" : undefined
                          )}
                        >
                          <TableCell className="space-y-1">
                            <p className="font-medium">{milestone.label}</p>
                            {milestone.isCurrent ? (
                              <Badge>In progress</Badge>
                            ) : milestone.isUpcoming ? (
                              <Badge variant="outline">Upcoming</Badge>
                            ) : null}
                          </TableCell>
                          <TableCell>
                            <span className="block">{formatDateRange(milestone.startDate, milestone.endDate)}</span>
                            <span className="block text-xs text-muted-foreground">{milestone.weekRange}</span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{milestone.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
            Enter a clinical reference date to generate a complete pregnancy wheel, including trimester boundaries and
            milestone checklists.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getEmbryoAgeDays(stage: "day3" | "day5" | "day6" | "custom", customAge?: number) {
  switch (stage) {
    case "day3":
      return 3
    case "day5":
      return 5
    case "day6":
      return 6
    case "custom":
    default:
      return customAge ?? 5
  }
}

function normalizeDate(date: Date) {
  return startOfDay(date)
}

function buildPregnancyResult({
  method,
  methodLabel,
  detail,
  dueDate,
}: {
  method: CalculationMethod
  methodLabel: string
  detail: string
  dueDate: Date
}): PregnancyResult {
  const normalizedDueDate = normalizeDate(dueDate)
  const today = startOfDay(new Date())
  const calculatedLmp = addDays(normalizedDueDate, -PREGNANCY_LENGTH_DAYS)
  const conceptionDate = addDays(normalizedDueDate, -CONCEPTION_OFFSET_DAYS)

  const rawDaysRemaining = differenceInCalendarDays(normalizedDueDate, today)
  const daysRemaining = Math.max(rawDaysRemaining, 0)
  const postpartumDays = rawDaysRemaining < 0 ? Math.abs(rawDaysRemaining) : 0

  const gestationalDays = clamp(
    PREGNANCY_LENGTH_DAYS - rawDaysRemaining,
    0,
    PREGNANCY_LENGTH_DAYS
  )
  const gestationalWeeks = Math.floor(gestationalDays / 7)
  const gestationalExtraDays = gestationalDays % 7

  const progress = (gestationalDays / PREGNANCY_LENGTH_DAYS) * 100
  const currentTrimester = postpartumDays > 0
    ? "Postpartum"
    : gestationalDays < 14 * 7
      ? "First trimester"
      : gestationalDays < 28 * 7
        ? "Second trimester"
        : "Third trimester"

  const trimesterRanges = buildTrimesterRanges(calculatedLmp, normalizedDueDate)
  const milestoneWindows = buildMilestoneWindows(calculatedLmp, today)
  const nextMilestone = milestoneWindows.find((milestone) => !isBefore(milestone.endDate, today))

  return {
    method,
    methodLabel,
    detail,
    dueDate: normalizedDueDate,
    lmp: calculatedLmp,
    conceptionDate,
    gestationalWeeks,
    gestationalDays: gestationalExtraDays,
    daysRemaining,
    postpartumDays,
    progress,
    currentTrimester,
    milestoneWindows,
    trimesterRanges,
    nextMilestone,
  }
}

function buildTrimesterRanges(lmp: Date, dueDate: Date): TrimesterRange[] {
  const firstTrimesterEnd = addDays(lmp, 13 * 7 + 6)
  const secondTrimesterStart = addDays(firstTrimesterEnd, 1)
  const secondTrimesterEnd = addDays(lmp, 27 * 7 + 6)
  const thirdTrimesterStart = addDays(secondTrimesterEnd, 1)

  return [
    {
      label: "First trimester",
      startDate: lmp,
      endDate: firstTrimesterEnd,
      weeksRange: "0w0 – 13w6",
    },
    {
      label: "Second trimester",
      startDate: secondTrimesterStart,
      endDate: secondTrimesterEnd,
      weeksRange: "14w0 – 27w6",
    },
    {
      label: "Third trimester",
      startDate: thirdTrimesterStart,
      endDate: dueDate,
      weeksRange: "28w0 – 40w0",
    },
  ]
}

function buildMilestoneWindows(lmp: Date, today: Date): MilestoneWindow[] {
  return milestoneConfig.map((milestone) => {
    const startDate = addDays(lmp, milestone.startWeek * 7)
    const endDate = addDays(
      lmp,
      milestone.endWeek * 7 + (milestone.endWeek === milestone.startWeek ? 0 : 6)
    )
    const isCurrent = !isBefore(today, startDate) && !isAfter(today, endDate)
    const isUpcoming = isBefore(today, startDate)

    return {
      label: milestone.label,
      startDate,
      endDate,
      weekRange: formatWeekRange(milestone.startWeek, milestone.endWeek),
      description: milestone.description,
      isCurrent,
      isUpcoming,
    }
  })
}

function formatWeekRange(startWeek: number, endWeek: number) {
  if (startWeek === endWeek) {
    return `${startWeek}w0`
  }
  return `${startWeek}w0 – ${endWeek}w6`
}

function formatDateRange(startDate: Date, endDate: Date) {
  if (isSameDay(startDate, endDate)) {
    return format(startDate, "PPP")
  }

  if (isSameMonth(startDate, endDate) && isSameYear(startDate, endDate)) {
    return `${format(startDate, "MMM d")} – ${format(endDate, "d, yyyy")}`
  }

  if (isSameYear(startDate, endDate)) {
    return `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`
  }

  return `${format(startDate, "PPP")} – ${format(endDate, "PPP")}`
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
