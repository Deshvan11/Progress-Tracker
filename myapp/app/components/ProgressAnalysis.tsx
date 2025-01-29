"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Task, TaskData, Notes, Media, ProgressAnalysisProps } from "@/types/tasks"

const TASKS = [
  {
    name: "Wake up early",
    colors: ["green", "yellow", "black", "red"],
    labels: ["Before 6am", "Before 7am", "Before 8am", "After 8am"],
  },
  {
    name: "Do exercise",
    colors: ["green", "yellow", "black", "red"],
    labels: ["6 sets", "5 sets", "2-4 sets", "No exercise"],
  },
  {
    name: "Namjapa",
    colors: ["green", "yellow", "black", "red"],
    labels: ["4 sets", "3 sets", "2 sets", "1 or 0 sets"],
  },
  {
    name: "Bhagwatam reading",
    colors: ["green", "red"],
    labels: ["Done", "Not done"],
  },
  {
    name: "3 SH book",
    colors: ["green", "yellow", "black", "red"],
    labels: ["3 books", "2 books", "1 book", "No books"],
  },
  {
    name: "Data science course",
    colors: ["green", "yellow", "black", "red"],
    labels: ["2 modules", "1 module", "1/2 module", "No modules"],
  },
  {
    name: "Data science books",
    colors: ["green", "yellow", "black", "red"],
    labels: ["3 books", "2 books", "1 book", "No books"],
  },
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

export default function ProgressAnalysis({ taskData, setTaskData }: ProgressAnalysisProps) {
  const [date, setDate] = useState<Date>(new Date(2025, 0, 1))
  const [notes, setNotes] = useState<Notes>({})
  const [media, setMedia] = useState<Media>({})
  const [openPopover, setOpenPopover] = useState<string | null>(null)
  const [currentNote, setCurrentNote] = useState<string>("")

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    const savedMedia = localStorage.getItem("media")
    if (savedNotes) setNotes(JSON.parse(savedNotes))
    if (savedMedia) setMedia(JSON.parse(savedMedia))
  }, [])

  const handleTaskClick = async (taskName: string, id: string, colorIndex: number) => {
    const dateStr = id.split("T")[0]
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateStr,
          taskName,
          colorIndex
        })
      })

      if (response.ok) {
        setTaskData((prev) => ({
          ...prev,
          [dateStr]: {
            ...prev[dateStr],
            [taskName]: colorIndex,
          },
        }))
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const getColorForTask = (taskName: string, id: string) => {
    const dateStr = id.split("T")[0]
    const task = TASKS.find((t) => t.name === taskName)
    if (!task) return "transparent"
    const colorIndex = taskData[dateStr]?.[taskName] ?? -1
    return colorIndex >= 0 && colorIndex < task.colors.length ? task.colors[colorIndex] : "transparent"
  }

  const handleNotesChange = (value: string) => {
    setCurrentNote(value)
  }

  const handleMediaUpload = (id: string, file: File) => {
    const dateStr = id.split("T")[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setMedia((prev) => ({
          ...prev,
          [dateStr]: reader.result as string,
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveNotes = (id: string) => {
    const dateStr = id.split("T")[0]
    const updatedNotes = {
      ...notes,
      [dateStr]: currentNote,
    }
    setNotes(updatedNotes)
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
    localStorage.setItem("media", JSON.stringify(media))
    console.log(`Saved notes for ${dateStr}:`, currentNote)
    console.log(`Saved media for ${dateStr}:`, media[dateStr])
    setOpenPopover(null)
  }

  interface WeekGridProps {
    weekDates: Date[];
    weekNumber: number;
  }

  const WeekGrid = ({ weekDates, weekNumber }: WeekGridProps) => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Week {weekNumber}</h3>
      <div className="border rounded-lg">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 font-medium">Task</div>
          {weekDates.map((date) => (
            <div key={date.toISOString()} className="p-2 font-medium text-center">
              <div>{DAYS[date.getDay()]}</div>
              <div>{date.getDate()}</div>
              <Popover
                open={openPopover === date.toISOString()}
                onOpenChange={(open) => {
                  if (open) {
                    setOpenPopover(date.toISOString())
                    setCurrentNote(notes[date.toISOString().split("T")[0]] || "")
                  } else {
                    setOpenPopover(null)
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-1">
                    Notes
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <Textarea
                      className="w-full p-2 border rounded"
                      placeholder="How was your day?"
                      rows={3}
                      value={currentNote}
                      onChange={(e) => handleNotesChange(e.target.value)}
                    />
                    <div>
                      <label
                        htmlFor={`file-upload-${date.toISOString()}`}
                        className="cursor-pointer bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Upload Image/Video
                      </label>
                      <input
                        id={`file-upload-${date.toISOString()}`}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => e.target.files && handleMediaUpload(date.toISOString(), e.target.files[0])}
                      />
                    </div>
                    {media[date.toISOString().split("T")[0]] && (
                      <div>
                        {media[date.toISOString().split("T")[0]].startsWith("data:image") ? (
                          <img
                            src={(media[date.toISOString().split("T")[0]] as string) || "/placeholder.svg"}
                            alt="Uploaded content"
                            className="max-w-full h-auto"
                          />
                        ) : (
                          <video
                            src={media[date.toISOString().split("T")[0]] as string}
                            controls
                            className="max-w-full h-auto"
                          />
                        )}
                      </div>
                    )}
                    <Button onClick={() => handleSaveNotes(date.toISOString())}>Save</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
        {TASKS.map((task) => (
          <div key={task.name} className="grid grid-cols-8 border-b last:border-b-0">
            <div className="p-2 border-r">{task.name}</div>
            {weekDates.map((date) => {
              const id = date.toISOString()
              return (
                <div key={id} className="flex items-center justify-center p-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: getColorForTask(task.name, id) }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="grid grid-cols-1 gap-1 p-2">
                        {task.colors.map((color, index) => (
                          <button
                            key={color}
                            className="flex items-center gap-2 p-1 hover:bg-gray-100 w-full"
                            onClick={() => handleTaskClick(task.name, id, index)}
                          >
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                            <span>{task.labels[index]}</span>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )

  const getMonthWeeks = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month)
    const weeks = []
    let currentWeek = []

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(year, month, day))
      if (currentWeek.length === 7 || day === daysInMonth) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    // If the last week is not complete, add null values to fill it
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      weeks.push(currentWeek)
    }

    return weeks
  }

  const monthWeeks = getMonthWeeks(date.getFullYear(), date.getMonth())

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Habit Tracker</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">{date.toLocaleString("default", { month: "long", year: "numeric" })}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {monthWeeks.map((week, index) => (
          <WeekGrid 
            key={index} 
            weekDates={week.filter((date): date is Date => date !== null)} 
            weekNumber={index + 1} 
          />
        ))}
      </CardContent>
    </Card>
  )
}

