'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

interface ChartProps {
  data: any[]
  width?: number
  height?: number
}

export function BarChart({ data, width = 500, height = 300 }: ChartProps) {
  return (
    <RechartsBarChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
      <YAxis />
      <Tooltip />
      <Bar dataKey="efficiency" fill="#8884d8" />
    </RechartsBarChart>
  )
}

export function PieChart({ data, width = 400, height = 400 }: ChartProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <RechartsPieChart width={width} height={height}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </RechartsPieChart>
  )
} 