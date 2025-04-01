"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from "recharts"

type MonthAbbr = "jan" | "fev" | "mar" | "abr" | "mai" | "jun" | "jul" | "ago" | "set" | "out" | "nov" | "dez"

interface ResultChartProps {
  data: any[]
  selectedCompany: string
  selectedYear: string
}

export function ResultChart({ data, selectedCompany, selectedYear }: ResultChartProps) {
  const chartData = useMemo(() => {
    // Filter data by selected company and year if any
    let filteredData = [...data]

    if (selectedCompany) {
      filteredData = filteredData.filter((item) => item.CIA === selectedCompany)
    }

    if (selectedYear) {
      filteredData = filteredData.filter((item) => {
        const date = new Date(item.PERÍODO)
        return date.getUTCFullYear().toString() === selectedYear
      })
    }

    // Create an object with all months initialized to zero
    const monthsTemplate: Record<MonthAbbr, { revenue: number; deductions: number; expenses: number }> = {
      jan: { revenue: 0, deductions: 0, expenses: 0 },
      fev: { revenue: 0, deductions: 0, expenses: 0 },
      mar: { revenue: 0, deductions: 0, expenses: 0 },
      abr: { revenue: 0, deductions: 0, expenses: 0 },
      mai: { revenue: 0, deductions: 0, expenses: 0 },
      jun: { revenue: 0, deductions: 0, expenses: 0 },
      jul: { revenue: 0, deductions: 0, expenses: 0 },
      ago: { revenue: 0, deductions: 0, expenses: 0 },
      set: { revenue: 0, deductions: 0, expenses: 0 },
      out: { revenue: 0, deductions: 0, expenses: 0 },
      nov: { revenue: 0, deductions: 0, expenses: 0 },
      dez: { revenue: 0, deductions: 0, expenses: 0 },
    }

    const monthlyData = { ...monthsTemplate }

    // Group by month and calculate revenue, deductions and expenses
    filteredData.forEach((item) => {
      const date = new Date(item.PERÍODO)
      // Usar o mês UTC para evitar problemas de fuso horário
      const monthIndex = date.getUTCMonth()
      const monthAbbrArray: MonthAbbr[] = [
        "jan",
        "fev",
        "mar",
        "abr",
        "mai",
        "jun",
        "jul",
        "ago",
        "set",
        "out",
        "nov",
        "dez",
      ]
      const monthAbbr = monthAbbrArray[monthIndex]

      if (item.GRUPO === "RECEITA") {
        monthlyData[monthAbbr].revenue += Number(item.VALOR)
      } else if (item.GRUPO === "DEDUCOES DE VENDAS") {
        monthlyData[monthAbbr].deductions += Number(item.VALOR) // Já é negativo
      } else if (item.GRUPO === "DESPESA") {
        monthlyData[monthAbbr].expenses += Number(item.VALOR) // Já é negativo
      }
    })

    // Calculate result and convert to array format for chart
    const result = Object.entries(monthlyData).map(([month, values]) => ({
      month,
      result: values.revenue + values.deductions + values.expenses, // Todos os valores já com sinais corretos
    }))

    // Define month order for sorting
    const monthOrder: MonthAbbr[] = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

    // Sort by month order
    return result.sort((a, b) => monthOrder.indexOf(a.month as MonthAbbr) - monthOrder.indexOf(b.month as MonthAbbr))
  }, [data, selectedCompany, selectedYear])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Find the min and max result values for setting the domain
  const resultValues = chartData.map((item: any) => item.result)
  const minResult = Math.min(...resultValues, 0)
  const maxResult = Math.max(...resultValues, 0)

  // Calculate average result for reference line
  const avgResult =
    chartData.length > 0 ? chartData.reduce((sum: number, item: any) => sum + item.result, 0) / chartData.length : 0

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={60}
            tickMargin={20}
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            domain={[minResult * 1.1, maxResult * 1.1]} // Add 10% padding to both ends
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Resultado Líquido"]}
            labelFormatter={(label) => `Período: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "10px",
            }}
          />
          <Legend verticalAlign="top" height={36} formatter={() => "Resultado Líquido"} />
          <ReferenceLine y={0} stroke="#666" strokeWidth={1} />
          <ReferenceLine
            y={avgResult}
            stroke="#10b981"
            strokeDasharray="3 3"
            label={{
              value: "Média",
              position: "insideBottomRight",
              fill: "#10b981",
              fontSize: 12,
            }}
          />
          <Bar dataKey="result" name="Resultado Líquido" radius={[4, 4, 0, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.result >= 0 ? "#10b981" : "#ef4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

