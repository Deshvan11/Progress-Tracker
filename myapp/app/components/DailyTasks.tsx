"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TASKS = ["Wake-up early", "Do exercise", "Namjap", "Bhagwatam Reading", "3SH Books", "DS Course", "DS Books"]

interface Task {
  name: string
  completed: boolean
}

export default function DailyTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    fetchTasks()
  }, []) // Removed unnecessary dependency: [date]

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks/${date}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    }
  }

  const toggleTask = async (taskName: string) => {
    try {
      const response = await fetch(`/api/tasks/${date}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: taskName,
          completed: !tasks.find((t) => t.name === taskName)?.completed,
        }),
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-4 p-2 border rounded" />
        <ul className="space-y-2">
          {TASKS.map((taskName) => {
            const task = tasks.find((t) => t.name === taskName) || { name: taskName, completed: false }
            return (
              <li key={taskName} className="flex items-center gap-2">
                <Checkbox id={taskName} checked={task.completed} onCheckedChange={() => toggleTask(taskName)} />
                <label htmlFor={taskName} className={task.completed ? "line-through" : ""}>
                  {taskName}
                </label>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

