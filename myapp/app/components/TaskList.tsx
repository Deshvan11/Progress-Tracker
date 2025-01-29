"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Task, TaskData } from "@/types/tasks"

interface TaskListProps {
  taskData: TaskData;
  setTaskData: (data: TaskData | ((prev: TaskData) => TaskData)) => void;
  date: string;
}

const TASKS = [
  {
    name: "Wake up early",
    colors: ["green", "yellow", "black", "red"],
    labels: ["Before 6am", "Before 7am", "Before 8am", "After 8am"],
  },
  // ... other tasks
]

export default function TaskList({ taskData, setTaskData, date }: TaskListProps) {
  const toggleTask = async (taskName: string, colorIndex: number) => {
    setTaskData((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [taskName]: colorIndex,
      },
    }))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Today's Tasks</h2>
      <ul className="space-y-2">
        {TASKS.map((task) => {
          const colorIndex = taskData[date]?.[task.name] ?? -1
          return (
            <li key={task.name} className="flex items-center gap-2">
              <Checkbox 
                id={task.name} 
                checked={colorIndex >= 0}
                onCheckedChange={() => toggleTask(task.name, colorIndex >= 0 ? -1 : 0)} 
              />
              <label htmlFor={task.name} className={colorIndex >= 0 ? "line-through" : ""}>
                {task.name}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

