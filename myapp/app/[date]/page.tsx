"use client"

import { useParams } from "next/navigation"
import DataAnalysis from "../components/DataAnalysis"
import ProgressAnalysis from "../components/ProgressAnalysis"
import { TaskData } from "@/types/tasks"
import { useState, useEffect } from "react"

export default function DatePage() {
  const params = useParams()
  const [taskData, setTaskData] = useState<TaskData>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/tasks?date=${params.date}`)
      .then(res => res.json())
      .then(data => {
        setTaskData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load tasks:', err)
        setLoading(false)
      })
  }, [params.date])

  if (loading) {
    return <div>Loading...</div>
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

