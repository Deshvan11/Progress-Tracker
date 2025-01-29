import { NextResponse } from "next/server"
import { ColorEfficiency } from '@/types/tasks'
import { tasks, taskCompletions } from '../route'

interface PatchBody {
  color: ColorEfficiency
  date: string
}

export async function PATCH(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params
  const body: PatchBody = await request.json()

  const completion = {
    taskId,
    date: body.date,
    color: body.color,
    efficiency: getEfficiencyForColor(body.color)
  }

  taskCompletions.push(completion)
  return NextResponse.json(completion)
}

function getEfficiencyForColor(color: ColorEfficiency): number {
  const efficiencies = {
    green: 100,
    yellow: 70,
    black: 40,
    red: 10
  }
  return efficiencies[color]
} 