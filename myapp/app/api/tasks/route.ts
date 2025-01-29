import { NextResponse } from "next/server"
import { TaskData, ColorEfficiency, TaskCompletion } from "@/types/tasks"
import { TASKS } from "@/app/constants/tasks"

export const tasks = TASKS
export let taskStore: TaskData = {}
export const taskCompletions: TaskCompletion[] = []

function getColorIndex(color: ColorEfficiency): number {
  const colorMap = {
    green: 0,
    yellow: 1,
    black: 2,
    red: 3
  }
  return colorMap[color]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const period = searchParams.get('period')
  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const week = searchParams.get('week')

  // Handle period-based analysis
  if (period) {
    let startDate: Date
    let endDate: Date
    
    if (period === 'week' && week) {
      startDate = new Date(Number(year), Number(month), 1 + (Number(week) - 1) * 7)
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)
    } else {
      startDate = new Date(Number(year), Number(month), 1)
      endDate = new Date(Number(year), Number(month) + 1, 0)
    }

    const analysisData = generateAnalysisData(startDate, endDate)
    return NextResponse.json(analysisData)
  }

  // Handle date-based task data
  if (date) {
    return NextResponse.json(taskStore[date] || {})
  }

  // Return all task data
  return NextResponse.json(taskStore)
}

export async function POST(request: Request) {
  const { date, taskName, colorIndex } = await request.json()
  
  if (!taskStore[date]) {
    taskStore[date] = {}
  }
  
  taskStore[date][taskName] = colorIndex
  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request) {
  const { taskName, date, color } = await request.json()
  const colorIndex = getColorIndex(color)
  
  if (!taskStore[date]) {
    taskStore[date] = {}
  }
  
  taskStore[date][taskName] = colorIndex
  return NextResponse.json({ success: true })
}

function generateAnalysisData(startDate: Date, endDate: Date) {
  const data: Record<string, Record<string, boolean>> = {}
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0]
    data[dateStr] = Object.fromEntries(
      TASKS.map(task => [task.name, Boolean(taskStore[dateStr]?.[task.name])])
    )
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

