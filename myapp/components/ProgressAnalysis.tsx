'use client'

import { useState } from 'react'
import { Task, TaskCompletion, TaskType } from '@/types/tasks'
import { BarChart, PieChart } from '@/components/charts'

interface ProgressAnalysisProps {
  tasks: Task[]
  completions: TaskCompletion[]
}

interface EfficiencyStats {
  taskName: string
  efficiency: number
  period: string
}

interface HighEfficiencyDay {
  date: string
  efficiency: number
}

export default function ProgressAnalysis({ tasks, completions }: ProgressAnalysisProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('weekly')
  const [selectedMonth, setSelectedMonth] = useState('January')
  const [selectedWeek, setSelectedWeek] = useState(1)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const quarters = [
    { name: 'Q1: Jan-Mar', months: ['January', 'February', 'March'] },
    { name: 'Q2: Apr-Jun', months: ['April', 'May', 'June'] },
    { name: 'Q3: Jul-Sep', months: ['July', 'August', 'September'] },
    { name: 'Q4: Oct-Dec', months: ['October', 'November', 'December'] }
  ]

  const getMostEfficientTask = (): EfficiencyStats => {
    // Implementation for finding most efficient task
    return {
      taskName: 'Bhagwatam reading',
      efficiency: 6.41,
      period: 'This monthly'
    }
  }

  const getAverageEfficiency = (): EfficiencyStats => {
    // Implementation for calculating average efficiency
    return {
      taskName: 'Overall',
      efficiency: 6.41,
      period: 'This monthly'
    }
  }

  const getHighestEfficiencyDays = (): HighEfficiencyDay[] => {
    // Implementation for finding highest efficiency days
    return [{
      date: '09/01/2025',
      efficiency: 42.86
    }]
  }

  const getHighestEfficiencyWeek = () => {
    return {
      week: 2,
      efficiency: 28.37
    }
  }

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Progress Analysis</h2>
      
      {/* Period Selection */}
      <div className="flex gap-4 mb-6">
        {['weekly', 'monthly', 'quarterly', 'yearly'].map((period) => (
          <button
            key={period}
            className={`px-4 py-2 rounded-md ${
              selectedPeriod === period ? 'bg-gray-100' : ''
            }`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Month Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Select Month</h3>
        <div className="grid grid-cols-4 gap-4">
          {months.map((month) => (
            <button
              key={month}
              className={`px-4 py-2 rounded ${
                selectedMonth === month ? 'bg-black text-white' : ''
              }`}
              onClick={() => setSelectedMonth(month)}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Week Selection */}
      <div className="mb-6">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((week) => (
            <button
              key={week}
              className={`px-4 py-2 ${
                selectedWeek === week ? 'bg-black text-white' : ''
              } rounded`}
              onClick={() => setSelectedWeek(week)}
            >
              Week {week}
            </button>
          ))}
        </div>
      </div>

      {/* Efficiency Stats */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Most Efficient Task</h3>
          <div className="text-xl mt-2">{getMostEfficientTask().taskName}</div>
          <div className="text-sm text-gray-500">{getMostEfficientTask().period}</div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Average Efficiency</h3>
          <div className="text-xl mt-2">{getAverageEfficiency().efficiency}%</div>
          <div className="text-sm text-gray-500">{getAverageEfficiency().period}</div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Highest Efficiency Day(s)</h3>
          {getHighestEfficiencyDays().map((day, index) => (
            <div key={index}>
              <div className="text-xl mt-2">{day.date}</div>
              <div className="text-sm">{day.efficiency}% efficiency</div>
            </div>
          ))}
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Highest Efficiency Week</h3>
          <div className="text-xl mt-2">Week {getHighestEfficiencyWeek().week}</div>
          <div className="text-sm">{getHighestEfficiencyWeek().efficiency}% efficiency</div>
        </div>
      </div>

      {/* Charts */}
      <div>
        <h3 className="text-lg font-medium mb-4">
          {selectedPeriod === 'weekly' ? 'Weekly' : 'Monthly'} Task Efficiency
        </h3>
        <div className="h-64 border rounded p-4">
          <BarChart data={tasks.map(task => ({
            name: task.name,
            efficiency: Math.random() * 100 // Replace with actual efficiency calculation
          }))} />
        </div>
      </div>

      {/* Overall Task Efficiency Pie Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Overall Task Efficiency</h3>
        <div className="h-64 border rounded p-4">
          <PieChart data={tasks.map(task => ({
            name: task.name,
            value: Math.random() * 100 // Replace with actual efficiency calculation
          }))} />
        </div>
      </div>
    </div>
  )
} 