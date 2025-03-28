"use client"

import { useMemo } from "react"
import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface GroupChartProps {
  data: any[]
  selectedCompany: string
  selectedYear: string
}

export function GroupChart({ data, selectedCompany, selectedYear }: GroupChartProps) {
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

    // Agrupar por GRUPO
    const groupData = filteredData.reduce((acc: any, item: any) => {
      const grupo = item.GRUPO

      if (!acc[grupo]) {
        acc[grupo] = {
          name: grupo,
          value: 0,
        }
      }

      // Para valores negativos, usamos valor absoluto
      if (Number(item.VALOR) < 0) {
        acc[grupo].value += Math.abs(Number(item.VALOR))
      } else {
        acc[grupo].value += Number(item.VALOR)
      }

      return acc
    }, {})

    // Convert to array and sort by value
    return Object.values(groupData)
      .sort((a: any, b: any) => b.value - a.value)
      .filter((item: any) => item.value > 0) // Remover itens com valor zero
  }, [data, selectedCompany, selectedYear])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const COLORS = {
    RECEITA: "#4f46e5",
    "DEDUCOES DE VENDAS": "#f59e0b",
    DESPESA: "#ef4444",
  }

  const getColor = (name: string) => {
    return COLORS[name as keyof typeof COLORS] || "#8b5cf6"
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium text-sm">{payload[0].name}</p>
          <p className="text-sm text-gray-700">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Nenhum dado disponível para os filtros selecionados</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={180}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value, entry, index) => <span className="text-sm font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

