'use client'

import { useState } from 'react'
import { Task, ColorEfficiency, TaskType, WeekDate } from '@/types/tasks'
import { Dialog } from '@/components/ui/Dialog'

interface ColorOption {
  color: ColorEfficiency
  label: string
  efficiency: number
}

type ColorOptions = {
  [K in TaskType]: ColorOption[]
}

interface HabitTrackerProps {
  currentDate: Date
  tasks: Task[]
  onTaskComplete: (taskId: string, color: ColorEfficiency) => void
  onSaveNote: (date: string, note: string, media?: File) => void
}

export default function HabitTracker({ currentDate, tasks, onTaskComplete, onSaveNote }: HabitTrackerProps) {
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [noteModal, setNoteModal] = useState({ isOpen: false, date: '', note: '', taskId: '' })
  const [selectedTask, setSelectedTask] = useState<{ id: string, type: TaskType } | null>(null)

  const getWeekDates = (weekNumber: number): WeekDate[] => {
    const firstDay = new Date(2025, 0, 1) // January 1, 2025
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() + (weekNumber - 1) * 7)
    
    const dates: WeekDate[] = []
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      dates.push({
        date: currentDate.getDate(),
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDate.getDay()],
        fullDate: currentDate.toISOString().split('T')[0]
      })
    }
    return dates
  }

  const handleTaskClick = (taskId: string, type: TaskType) => {
    setSelectedTask({ id: taskId, type })
  }

  const handleColorSelect = (color: ColorEfficiency) => {
    if (selectedTask) {
      onTaskComplete(selectedTask.id, color)
      setSelectedTask(null)
    }
  }

  const weekDates = getWeekDates(selectedWeek)

  const colorOptions: ColorOptions = {
    'Wake-up early': [
      { color: 'green', label: 'Before 6am', efficiency: 100 },
      { color: 'yellow', label: 'Before 7am', efficiency: 70 },
      { color: 'black', label: 'Before 8am', efficiency: 40 },
      { color: 'red', label: 'After 8am', efficiency: 10 }
    ],
    'Do exercise': [
      { color: 'green', label: '6 sets', efficiency: 100 },
      { color: 'yellow', label: '5 sets', efficiency: 90 },
      { color: 'black', label: '2-4 sets', efficiency: 50 },
      { color: 'red', label: 'No exercise', efficiency: 0 }
    ],
    'Namjapa': [
      { color: 'green', label: '4 sets', efficiency: 100 },
      { color: 'yellow', label: '3 sets', efficiency: 80 },
      { color: 'black', label: '2 sets', efficiency: 60 },
      { color: 'red', label: '0-1 sets', efficiency: 50 }
    ],
    'Bhagwatam Reading': [
      { color: 'green', label: 'Done', efficiency: 100 },
      { color: 'red', label: 'Not done', efficiency: 0 }
    ],
    '3SH Books': [
      { color: 'green', label: '3 books', efficiency: 100 },
      { color: 'yellow', label: '2 books', efficiency: 80 },
      { color: 'black', label: '1 book', efficiency: 60 },
      { color: 'red', label: 'No books', efficiency: 0 }
    ],
    'DS Course': [
      { color: 'green', label: '2 modules', efficiency: 100 },
      { color: 'yellow', label: '1 module', efficiency: 80 },
      { color: 'black', label: '1/2 module', efficiency: 40 },
      { color: 'red', label: 'No modules', efficiency: 0 }
    ],
    'DS Books': [
      { color: 'green', label: '3 books', efficiency: 100 },
      { color: 'yellow', label: '2 books', efficiency: 80 },
      { color: 'black', label: '1 book', efficiency: 40 },
      { color: 'red', label: 'No books', efficiency: 0 }
    ]
  }

  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Habit Tracker</h2>
        <div className="border rounded px-4 py-2">January 2025</div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-4">Week {selectedWeek}</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Task</th>
              {weekDates.map((date, i) => (
                <th key={i} className="text-center">
                  <div>{date.day}</div>
                  <div>{date.date}</div>
                  <button 
                    className="text-xs text-gray-500"
                    onClick={() => setNoteModal({ isOpen: true, date: date.fullDate, note: '', taskId: '' })}
                  >
                    Notes
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="py-2">{task.name}</td>
                {weekDates.map((date) => (
                  <td key={date.fullDate} className="text-center">
                    <button 
                      className="w-6 h-6 rounded-full border"
                      onClick={() => handleTaskClick(task.id, task.type)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color Selection Dialog */}
      {selectedTask && (
        <Dialog
          open={true}
          onClose={() => setSelectedTask(null)}
        >
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Select Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {colorOptions[selectedTask.type].map((option) => (
                <button
                  key={option.color}
                  className={`p-2 rounded ${option.color === 'green' ? 'bg-green-500' : 
                    option.color === 'yellow' ? 'bg-yellow-500' : 
                    option.color === 'black' ? 'bg-black' : 'bg-red-500'} text-white`}
                  onClick={() => handleColorSelect(option.color)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </Dialog>
      )}

      {/* Notes Dialog */}
      <Dialog
        open={noteModal.isOpen}
        onClose={() => setNoteModal({ ...noteModal, isOpen: false })}
      >
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Notes for {noteModal.date}</h3>
          <textarea
            className="w-full h-32 border rounded p-2 mb-4"
            value={noteModal.note}
            onChange={(e) => setNoteModal({ ...noteModal, note: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setNoteModal({ ...noteModal, isOpen: false })}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => {
                onSaveNote(noteModal.date, noteModal.note)
                setNoteModal({ ...noteModal, isOpen: false })
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
} 