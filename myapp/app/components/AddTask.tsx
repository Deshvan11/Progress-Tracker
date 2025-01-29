"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddTask() {
  const [taskName, setTaskName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskName.trim()) return

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: taskName }),
      })

      if (response.ok) {
        setTaskName("")
        // You might want to add some state update logic here to refresh the task list
      }
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter a new task"
          className="flex-grow"
        />
        <Button type="submit">Add Task</Button>
      </div>
    </form>
  )
}

