"use client"

import React, { useMemo } from "react"
import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Definir tipo para os dados do gráfico
interface ChartDataItem {
  name: string
  value: number
}

interface SubgroupChartProps {
  data: any[]
  selectedCompanies: string[]
  selectedYear: string
  selectedGroup: string
  selectedMonths: string[]
}

export function SubgroupChart({
  data,
  selectedCompanies,
  selectedYear,
  selectedGroup,
  selectedMonths,
}: SubgroupChartProps) {
  // Adicionar este hook no início da função SubgroupChart, logo após a declaração das props
  const [chartSize, setChartSize] = React.useState(120)

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setChartSize(80)
      } else if (width < 1024) {
        setChartSize(100)
      } else {
        setChartSize(120)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

    if (selectedGroup && selectedGroup !== "Todos") {
      filteredData = filteredData.filter((item) => item.GRUPO === selectedGroup)
    }

    // Agrupar por SUBGRUPO
    const subgroupData: Record<string, ChartDataItem> = filteredData.reduce(
      (acc: Record<string, ChartDataItem>, item: any) => {
        const subgrupo = item.SUBGRUPO

        if (!acc[subgrupo]) {
          acc[subgrupo] = {
            name: subgrupo,
            value: 0,
          }
        }

        // Tratamento especial para "DESPESA COM PESSOAL" em dezembro
        if (subgrupo.toUpperCase() === "DESPESA COM PESSOAL") {
          const date = new Date(item.PERÍODO)
          const isDecember = date.getUTCMonth() === 11

          if (isDecember) {
            // Para dezembro, usar o valor considerando o sinal
            const valorAtual = Number(item.VALOR)
            // Se for negativo, usar o valor absoluto; se for positivo, usar o valor como está
            const valorAdicionar = valorAtual < 0 ? Math.abs(valorAtual) : valorAtual
            acc[subgrupo].value += valorAdicionar
          } else {
            // Para outros meses, usar valor absoluto
            acc[subgrupo].value += Math.abs(Number(item.VALOR))
          }
        } else {
          // Para outros subgrupos, usar valor absoluto normalmente
          acc[subgrupo].value += Math.abs(Number(item.VALOR))
        }

        return acc
      },
      {},
    )

    // Convert to array and sort by value
    return Object.values(subgroupData)
      .sort((a, b) => b.value - a.value)
      .filter((item) => item.value > 0) // Remover itens com valor zero
  }, [data, selectedCompanies, selectedYear, selectedGroup, selectedMonths])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Definir cores para o gráfico
  const COLORS: string[] = [
    "#4f46e5",
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ]

  // Definir tipos para os parâmetros da função renderCustomizedLabel
  interface CustomizedLabelProps {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
    index: number
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: CustomizedLabelProps) => {
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
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={chartSize}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value, _entry, _index) => <span className="text-xs sm:text-sm font-medium">{value}</span>}
            wrapperStyle={{ fontSize: "10px", marginTop: "10px", paddingTop: "15px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
