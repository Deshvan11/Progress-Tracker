"use client"

import { useState, useEffect } from "react"
import ProgressAnalysis from "./components/ProgressAnalysis"
import DataAnalysis from "./components/DataAnalysis"
import { TaskData } from "@/types/tasks"

export default function Home() {
  const [taskData, setTaskData] = useState<TaskData>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load initial data
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTaskData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load tasks:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Habit Tracker & Progress Analysis</h1>
      <div className="grid grid-cols-2 gap-8">
        <ProgressAnalysis taskData={taskData} setTaskData={setTaskData} />
        <DataAnalysis taskData={taskData} />
      </div>
    </main>
  )
}
