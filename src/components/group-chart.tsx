"use client"

import { useMemo } from "react"
import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Definir tipos para os grupos financeiros
type FinancialGroup = "RECEITA" | "DEDUCOES DE VENDAS" | "DESPESA"

// Definir tipo para os dados do gráfico
interface ChartDataItem {
  name: string
  value: number
}

// Definir tipo para as cores dos grupos
type GroupColors = {
  [key in FinancialGroup]: string
}

interface GroupChartProps {
  data: any[]
  selectedCompanies: string[]
  selectedYear: string
  selectedMonths: string[]
}

export function GroupChart({ data, selectedCompanies, selectedYear, selectedMonths }: GroupChartProps) {
  const chartData = useMemo(() => {
    // Filter data by selected companies and year if any
    let filteredData = [...data]

    // Filtrar por empresas selecionadas (múltiplas)
    if (selectedCompanies.length > 0) {
      filteredData = filteredData.filter((item) => selectedCompanies.includes(item.CIA))
    }

    if (selectedYear) {
      filteredData = filteredData.filter((item) => {
        const date = new Date(item.PERÍODO)
        return date.getUTCFullYear().toString() === selectedYear
      })
    }

    // Filtrar por meses selecionados (múltiplos)
    if (selectedMonths.length > 0) {
      filteredData = filteredData.filter((item) => {
        const date = new Date(item.PERÍODO)
        // Usar os meses em português baseados no índice do mês UTC
        const monthIndex = date.getUTCMonth()
        const monthNames = [
          "janeiro",
          "fevereiro",
          "março",
          "abril",
          "maio",
          "junho",
          "julho",
          "agosto",
          "setembro",
          "outubro",
          "novembro",
          "dezembro",
        ]
        const itemMonth = monthNames[monthIndex].toLowerCase()
        return selectedMonths.includes(itemMonth)
      })
    }

    // Agrupar por GRUPO
    const groupData: Record<string, ChartDataItem> = filteredData.reduce(
      (acc: Record<string, ChartDataItem>, item: any) => {
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
      },
      {},
    )

    // Convert to array and sort by value
    return Object.values(groupData)
      .sort((a, b) => b.value - a.value)
      .filter((item) => item.value > 0) // Remover itens com valor zero
  }, [data, selectedCompanies, selectedYear, selectedMonths])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Definir cores para cada grupo com tipagem adequada
  const COLORS: GroupColors = {
    RECEITA: "#4f46e5",
    "DEDUCOES DE VENDAS": "#f59e0b",
    DESPESA: "#ef4444",
  }

  // Função para obter a cor com base no nome do grupo
  const getColor = (name: string): string => {
    // Verificar se o nome é uma chave válida do objeto COLORS
    return name in COLORS ? COLORS[name as FinancialGroup] : "#8b5cf6"
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
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

  // Definir tipo para o objeto de payload do tooltip
  interface TooltipPayload {
    name: string
    value: number
    payload?: any
  }

  interface CustomTooltipProps {
    active?: boolean
    payload?: TooltipPayload[]
    label?: string
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
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
            formatter={(value) => <span className="text-sm font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

