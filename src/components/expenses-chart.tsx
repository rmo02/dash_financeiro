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
  ResponsiveContainer,
} from "recharts"

// Adicionar uma definição de tipo para as abreviações de mês no início do arquivo, logo após as importações
type MonthAbbr = "jan" | "fev" | "mar" | "abr" | "mai" | "jun" | "jul" | "ago" | "set" | "out" | "nov" | "dez"

interface ExpensesChartProps {
  data: any[]
  selectedCompany: string
  selectedYear: string
}

export function ExpensesChart({ data, selectedCompany, selectedYear }: ExpensesChartProps) {
  // Modificar a parte do código que pode estar causando o erro, dentro da função useMemo
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
    const monthsTemplate: Record<MonthAbbr, number> = {
      jan: 0,
      fev: 0,
      mar: 0,
      abr: 0,
      mai: 0,
      jun: 0,
      jul: 0,
      ago: 0,
      set: 0,
      out: 0,
      nov: 0,
      dez: 0,
    }

    const monthlyData = { ...monthsTemplate }

    // Group by month and calculate expenses
    filteredData.forEach((item) => {
      // Considerar apenas despesas do grupo DESPESA
      if (item.GRUPO === "DESPESA") {
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

        // Agora o TypeScript sabe que monthAbbr é uma chave válida
        monthlyData[monthAbbr] += Math.abs(Number(item.VALOR))
      }
    })

    // Convert to array format for chart
    const result = Object.entries(monthlyData).map(([month, expenses]) => ({
      month,
      expenses,
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

  // Find the maximum expense value for setting the domain
  const maxExpense = Math.max(...chartData.map((item: any) => item.expenses), 0)

  // Calculate average expenses for reference line
  const avgExpense =
    chartData.length > 0 ? chartData.reduce((sum: number, item: any) => sum + item.expenses, 0) / chartData.length : 0

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
            domain={[0, maxExpense * 1.1]} // Add 10% padding to the top
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Despesas"]}
            labelFormatter={(label) => `Período: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "10px",
            }}
          />
          <Legend verticalAlign="top" height={36} formatter={() => "Despesas"} />
          <ReferenceLine
            y={avgExpense}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{
              value: "Média",
              position: "insideBottomRight",
              fill: "#ef4444",
              fontSize: 12,
            }}
          />
          <Bar dataKey="expenses" fill="#ef4444" name="Despesas" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

