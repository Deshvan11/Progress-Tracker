"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TASKS } from "@/app/constants/tasks"
import { TaskData } from "@/types/tasks"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const QUARTERS = [
  { name: "Q1", months: "Jan-Mar" },
  { name: "Q2", months: "Apr-Jun" },
  { name: "Q3", months: "Jul-Sep" },
  { name: "Q4", months: "Oct-Dec" },
]

const getColorForEfficiency = (efficiency: number) => {
  if (efficiency >= 80) return "#4CAF50" // green
  if (efficiency >= 70) return "#FFC107" // yellow
  if (efficiency >= 40) return "#000000" // black
  return "#F44336" // red
}

interface DataAnalysisProps {
  taskData: TaskData;
}

interface AnalysisData {
  name: string;
  efficiency: number;
}

type PeriodType = "weekly" | "monthly" | "quarterly" | "yearly"

export default function DataAnalysis({ taskData }: DataAnalysisProps) {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('weekly')
  const [selectedYear, setSelectedYear] = useState(2025)
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [selectedQuarter, setSelectedQuarter] = useState(0)

  const getEfficiencyForTask = (taskName: string, dateStr: string): number => {
    const task = TASKS.find((t) => t.name === taskName)
    if (!task) return 0
    const colorIndex = taskData[dateStr]?.[taskName] ?? -1
    return colorIndex >= 0 && colorIndex < task.efficiencies.length ? task.efficiencies[colorIndex] : 0
  }

  const calculateAverageEfficiency = (taskName: string, startDate: Date, endDate: Date): number => {
    let totalEfficiency = 0
    let daysCount = 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      totalEfficiency += getEfficiencyForTask(taskName, dateStr)
      daysCount++
    }
    return totalEfficiency / daysCount
  }

  const getAnalysisData = (startDate: Date, endDate: Date) => {
    return TASKS.map((task) => ({
      name: task.name,
      efficiency: calculateAverageEfficiency(task.name, startDate, endDate),
    }))
  }

  const getDateRange = () => {
    const now = new Date(selectedYear, selectedMonth, 1)
    let startDate, endDate
    switch (period) {
      case "weekly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1 + (selectedWeek - 1) * 7)
        endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 6)
        break
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case "quarterly":
        startDate = new Date(now.getFullYear(), selectedQuarter * 3, 1)
        endDate = new Date(now.getFullYear(), (selectedQuarter + 1) * 3, 0)
        break
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
    }
    return { startDate, endDate }
  }

  const { startDate, endDate } = getDateRange()
  const analysisData = getAnalysisData(startDate, endDate)

  const getMostEfficientTask = (data: AnalysisData[]): string => {
    return data.reduce((prev, current) => 
      prev.efficiency > current.efficiency ? prev : current
    ).name
  }

  const getAverageEfficiency = (data: AnalysisData[]): string => {
    return (data.reduce((sum: number, task) => sum + task.efficiency, 0) / data.length).toFixed(2)
  }

  const getHighestEfficiencyDays = () => {
    let highestEfficiency = 0
    let highestDays: Date[] = []
    const { startDate, endDate } = getDateRange()

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      if (taskData[dateStr]) {
        const dayEfficiency =
          TASKS.reduce((sum, task) => {
            const colorIndex = taskData[dateStr][task.name] ?? -1
            return sum + (colorIndex >= 0 ? task.efficiencies[colorIndex] : 0)
          }, 0) / TASKS.length

        if (dayEfficiency > highestEfficiency) {
          highestEfficiency = dayEfficiency
          highestDays = [new Date(d)]
        } else if (dayEfficiency === highestEfficiency) {
          highestDays.push(new Date(d))
        }
      }
    }

    return { dates: highestDays, efficiency: highestEfficiency }
  }

  const getHighestEfficiencyWeek = () => {
    let highestEfficiency = 0
    let highestWeek = 1
    const { startDate, endDate } = getDateRange()
    const totalWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))

    for (let week = 1; week <= totalWeeks; week++) {
      const weekStartDate = new Date(startDate.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000)
      const weekEndDate = new Date(Math.min(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000, endDate.getTime()))
      const weekEfficiency = Number.parseFloat(getAverageEfficiency(getAnalysisData(weekStartDate, weekEndDate)))

      if (weekEfficiency > highestEfficiency) {
        highestEfficiency = weekEfficiency
        highestWeek = week
      }
    }

    return { weekNumber: highestWeek, efficiency: highestEfficiency }
  }

  const getHighestEfficiencyQuarter = () => {
    let highestEfficiency = 0
    let highestQuarter = 1
    for (let quarter = 0; quarter < 4; quarter++) {
      const quarterStartDate = new Date(selectedYear, quarter * 3, 1)
      const quarterEndDate = new Date(selectedYear, (quarter + 1) * 3, 0)
      const quarterEfficiency = Number.parseFloat(
        getAverageEfficiency(getAnalysisData(quarterStartDate, quarterEndDate)),
      )

      if (quarterEfficiency > highestEfficiency) {
        highestEfficiency = quarterEfficiency
        highestQuarter = quarter + 1
      }
    }
    return { quarter: highestQuarter, efficiency: highestEfficiency }
  }

  const generateMonthButtons = () => {
    return MONTHS.map((month, index) => (
      <Button
        key={month}
        variant={selectedMonth === index ? "default" : "outline"}
        onClick={() => setSelectedMonth(index)}
        className="m-1"
      >
        {month}
      </Button>
    ))
  }

  const generateWeekButtons = () => {
    const weeksInMonth = getWeeksInMonth(selectedYear, selectedMonth)
    return weeksInMonth.map((week, index) => (
      <Button
        key={index}
        variant={selectedWeek === index + 1 ? "default" : "outline"}
        onClick={() => setSelectedWeek(index + 1)}
        className="m-1"
      >
        Week {index + 1}
      </Button>
    ))
  }

  const generateQuarterButtons = () => {
    return QUARTERS.map((quarter, index) => (
      <Button
        key={quarter.name}
        variant={selectedQuarter === index ? "default" : "outline"}
        onClick={() => setSelectedQuarter(index)}
        className="m-1"
      >
        {quarter.name}: {quarter.months}
      </Button>
    ))
  }

  const getWeeksInMonth = (year: number, month: number): number[] => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const weeksInMonth = Math.ceil((daysInMonth + firstDay.getDay()) / 7)
    return Array.from({ length: weeksInMonth }, (_, i) => i + 1)
  }

  const fetchData = async (startDate: Date, endDate: Date) => {
    try {
      const response = await fetch(`/api/tasks?date=${startDate.toISOString().split('T')[0]}`)
      if (response.ok) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
    return {}
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Progress Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            {['weekly', 'monthly', 'quarterly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as typeof period)}
                className={`px-4 py-2 rounded ${
                  period === p ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <Tabs<PeriodType>
            value={period}
            onValueChange={setPeriod}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>

            <TabsContent value={period} className="space-y-4">
              {period === "weekly" && (
                <Card>
                  <CardHeader>
                    <CardTitle>{MONTHS[selectedMonth]} {selectedYear}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap">{generateWeekButtons()}</div>
                  </CardContent>
                </Card>
              )}

              {period === "monthly" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap">{generateMonthButtons()}</div>
                  </CardContent>
                </Card>
              )}

              {period === "quarterly" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Quarter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap">{generateQuarterButtons()}</div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>
                    {period.charAt(0).toUpperCase() + period.slice(1)} Task Efficiency
                    {period === "weekly" && ` - Week ${selectedWeek} of ${MONTHS[selectedMonth]}`}
                    {period === "monthly" && ` - ${MONTHS[selectedMonth]}`}
                    {period === "quarterly" && ` - ${QUARTERS[selectedQuarter].name}: ${QUARTERS[selectedQuarter].months}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analysisData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="efficiency">
                          {analysisData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColorForEfficiency(entry.efficiency)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Most Efficient Task</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ 
                      color: getColorForEfficiency(
                        analysisData.reduce((prev, current) => 
                          prev.efficiency > current.efficiency ? prev : current
                        ).efficiency
                      )
                    }}>
                      {getMostEfficientTask(analysisData)}
                    </div>
                    <div className="text-sm text-muted-foreground">This {period}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ color: getColorForEfficiency(parseFloat(getAverageEfficiency(analysisData))) }}>
                      {getAverageEfficiency(analysisData)}%
                    </div>
                    <div className="text-sm text-muted-foreground">This {period}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Highest Efficiency Day(s)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const { dates, efficiency } = getHighestEfficiencyDays();
                      return (
                        <div className="space-y-2">
                          <div className="max-h-24 overflow-y-auto">
                            {dates.length > 0
                              ? dates.map((date) => (
                                  <div key={date.toISOString()}>
                                    {date.toLocaleDateString()}
                                  </div>
                                ))
                              : 'N/A'}
                          </div>
                          <div
                            className="text-sm text-muted-foreground"
                            style={{ color: getColorForEfficiency(efficiency) }}
                          >
                            {efficiency.toFixed(2)}% efficiency
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Highest Efficiency Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const { weekNumber, efficiency } = getHighestEfficiencyWeek()
                      return (
                        <>
                          <div>Week {weekNumber}</div>
                          <div className="text-sm text-muted-foreground" style={{ color: getColorForEfficiency(efficiency) }}>{efficiency.toFixed(2)}% efficiency</div>
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Overall Task Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analysisData}
                          dataKey="efficiency"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {analysisData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColorForEfficiency(entry.efficiency)} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

