'use client';

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  TrendingUp,
  PieChart,
  LineChart,
  Activity,
  Calendar,
  Download,
  Maximize2
} from 'lucide-react'

interface ChartData {
  name: string
  value: number
  change?: number
  color?: string
}

interface ChartProps {
  title: string
  type: 'bar' | 'line' | 'pie' | 'area'
  data: ChartData[]
  height?: number
  showLegend?: boolean
  className?: string
}

const Charts = ({
  title,
  type,
  data,
  height = 300,
  showLegend = true,
  className = ''
}: ChartProps) => {
  const getChartIcon = () => {
    switch (type) {
      case 'bar': return BarChart3
      case 'line': return LineChart
      case 'pie': return PieChart
      case 'area': return Activity
      default: return BarChart3
    }
  }

  const Icon = getChartIcon()

  const renderBarChart = () => {
    // Handle empty or invalid data
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <BarChart3 className="w-12 h-12 mx-auto opacity-20" />
            <p>No chart data available</p>
          </div>
        </div>
      )
    }

    // Ensure all data points have valid values
    const validData = data.filter(item => item && typeof item.value === 'number' && !isNaN(item.value))

    if (validData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <BarChart3 className="w-12 h-12 mx-auto opacity-20" />
            <p>Invalid chart data</p>
          </div>
        </div>
      )
    }

    const maxValue = Math.max(...validData.map(d => d.value))

    return (
      <div className="flex items-end justify-between h-full gap-2 px-4 pb-4">
        {validData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%`, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div className="text-xs font-medium text-muted-foreground">
              ${item.value.toLocaleString()}
            </div>
            <div
              className={`w-full rounded-t-lg bg-gradient-to-t ${
                item.color || 'from-primary to-primary/80'
              } shadow-lg hover:shadow-xl transition-shadow`}
              style={{ minHeight: '20px' }}
            />
            <div className="text-xs text-muted-foreground text-center">
              {item.name}
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  const renderLineChart = () => {
    // Handle empty or invalid data
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <LineChart className="w-12 h-12 mx-auto opacity-20" />
            <p>No chart data available</p>
          </div>
        </div>
      )
    }

    // Ensure all data points have valid values
    const validData = data.filter(item => item && typeof item.value === 'number' && !isNaN(item.value))

    if (validData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <LineChart className="w-12 h-12 mx-auto opacity-20" />
            <p>Invalid chart data</p>
          </div>
        </div>
      )
    }

    const maxValue = Math.max(...validData.map(d => d.value))
    const minValue = Math.min(...validData.map(d => d.value))
    const valueRange = maxValue - minValue || 1 // Prevent division by zero

    return (
      <div className="relative h-full p-4">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={i * 40}
              x2="400"
              y2={i * 40}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          ))}

          {/* Line path */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d={`M 0 ${200 - ((validData[0]?.value || 0) - minValue) / valueRange * 160} ${validData.map((item, index) =>
              `L ${(index * 400) / (validData.length - 1)} ${200 - ((item.value - minValue) / valueRange) * 160}`
            ).join(' ')}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary"
          />

          {/* Area fill */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            d={`M 0 200 L 0 ${200 - ((validData[0]?.value || 0) - minValue) / valueRange * 160} ${validData.map((item, index) =>
              `L ${(index * 400) / (validData.length - 1)} ${200 - ((item.value - minValue) / valueRange) * 160}`
            ).join(' ')} L 400 200 Z`}
            fill="url(#lineGradient)"
            className="text-primary"
          />

          {/* Data points */}
          {validData.map((item, index) => (
            <motion.circle
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 1, duration: 0.3 }}
              cx={(index * 400) / (validData.length - 1)}
              cy={200 - ((item.value - minValue) / valueRange) * 160}
              r="4"
              fill="currentColor"
              className="text-primary"
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {validData.map((item, index) => (
            <span key={index}>{item.name}</span>
          ))}
        </div>
      </div>
    )
  }

  const renderPieChart = () => {
    // Handle empty or invalid data
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <PieChart className="w-12 h-12 mx-auto opacity-20" />
            <p>No chart data available</p>
          </div>
        </div>
      )
    }

    // Ensure all data points have valid values
    const validData = data.filter(item => item && typeof item.value === 'number' && !isNaN(item.value))

    if (validData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <PieChart className="w-12 h-12 mx-auto opacity-20" />
            <p>Invalid chart data</p>
          </div>
        </div>
      )
    }

    const total = validData.reduce((sum, d) => sum + d.value, 0)

    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {validData.map((item, index) => {
              const percentage = (item.value / total) * 100
              const strokeDasharray = `${percentage} ${100 - percentage}`
              const strokeDashoffset = validData.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 100, 0)

              return (
                <motion.circle
                  key={index}
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray }}
                  transition={{ delay: index * 0.2, duration: 1, ease: "easeOut" }}
                  cx="50"
                  cy="50"
                  r="15.915"
                  fill="transparent"
                  stroke={item.color || `hsl(${index * 60}, 70%, 50%)`}
                  strokeWidth="8"
                  strokeDashoffset={-strokeDashoffset}
                  className="origin-center"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {total.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'bar': return renderBarChart()
      case 'line': case 'area': return renderLineChart()
      case 'pie': return renderPieChart()
      default: return renderBarChart()
    }
  }

  return (
    <Card className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Live Data
            </Badge>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="relative">
          {renderChart()}
        </div>

        {showLegend && type === 'pie' && data && data.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.filter(item => item && typeof item.value === 'number' && !isNaN(item.value)).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)` }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium ml-auto">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {type !== 'pie' && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last 30 days
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                +12.5% from last period
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Pre-built chart components for common use cases
export const SpendingChart = ({ data }: { data: ChartData[] }) => (
  <Charts
    title="Monthly Spending"
    type="bar"
    data={data}
    height={250}
  />
)

export const IncomeChart = ({ data }: { data: ChartData[] }) => (
  <Charts
    title="Income Trend"
    type="line"
    data={data}
    height={250}
  />
)

export const CategoryChart = ({ data }: { data: ChartData[] }) => (
  <Charts
    title="Spending by Category"
    type="pie"
    data={data}
    height={300}
  />
)

export const BalanceChart = ({ data }: { data: ChartData[] }) => (
  <Charts
    title="Balance Over Time"
    type="area"
    data={data}
    height={200}
  />
)

export default Charts
