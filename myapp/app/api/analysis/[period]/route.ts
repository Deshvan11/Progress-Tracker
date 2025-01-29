import { NextResponse } from "next/server"
import { TASKS } from "@/app/constants/tasks"

export async function GET(request: Request, { params }: { params: { period: "week" | "month" } }) {
  const { searchParams } = new URL(request.url)
  const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())
  const month = Number.parseInt(searchParams.get("month") || new Date().getMonth().toString())
  const week = searchParams.get("week")

  // This would be replaced with actual database queries
  const generateDummyData = (startDate: Date, endDate: Date) => {
    const data: Record<string, Record<string, boolean>> = {}
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0]
      data[dateStr] = Object.fromEntries(TASKS.map((task) => [task, Math.random() > 0.5]))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
  }

  let startDate: Date
  let endDate: Date

  if (params.period === "week" && week) {
    // Calculate week start and end dates
    const weekNum = Number.parseInt(week)
    startDate = new Date(year, month, 1 + (weekNum - 1) * 7)
    endDate = new Date(year, month, 7 + (weekNum - 1) * 7)
  } else {
    // Calculate month start and end dates
    startDate = new Date(year, month, 1)
    endDate = new Date(year, month + 1, 0)
  }

  const data = generateDummyData(startDate, endDate)
  return NextResponse.json(data)
}

