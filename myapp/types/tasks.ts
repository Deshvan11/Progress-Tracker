export type ColorEfficiency = 'green' | 'yellow' | 'black' | 'red'

export type TaskType = 'Wake-up early' | 'Do exercise' | 'Namjapa' | 
  'Bhagwatam Reading' | '3SH Books' | 'DS Course' | 'DS Books'

export interface Task {
  name: string;
  colors: string[];
  labels: string[];
  efficiencies: number[];
}

export interface TaskData {
  [date: string]: {
    [taskName: string]: number;
  };
}

export interface Notes {
  [date: string]: string;
}

export interface Media {
  [date: string]: string;
}

export interface ProgressAnalysisProps {
  taskData: TaskData;
  setTaskData: (data: TaskData | ((prev: TaskData) => TaskData)) => void;
}

export interface TaskCompletion {
  taskId: string
  date: string
  color: ColorEfficiency
  efficiency: number
  note?: string
  media?: string
}

export interface WeekDate {
  date: number
  day: string
  fullDate: string
} 