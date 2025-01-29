"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskData } from "@/types/tasks"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ProgressChartProps {
  taskData: TaskData;
}

export default function ProgressChart({ taskData }: ProgressChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-2">Progress Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.entries(taskData).map(([date, tasks]) => ({
              date,
              completion: Object.values(tasks).filter(v => v >= 0).length,
              total: Object.keys(tasks).length
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completion" fill="#4CAF50" name="Completed" />
              <Bar dataKey="total" fill="#FFC107" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

