"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Adicionar uma definição de tipo para as abreviações de mês no início do arquivo, logo após as importações
type MonthAbbr = "jan" | "fev" | "mar" | "abr" | "mai" | "jun" | "jul" | "ago" | "set" | "out" | "nov" | "dez"

interface RevenueChartProps {
  data: any[]
  selectedCompanies: string[]
  selectedYear: string
  selectedMonths: string[]
}

export function RevenueChart({ data, selectedCompanies, selectedYear, selectedMonths }: RevenueChartProps) {
  // Modificar a parte do código que pode estar causando o erro, dentro da função useMemo
  const chartData = useMemo(() => {
    // Filter data by selected year and months
    let filteredData = [...data]

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

    // Se não houver empresas selecionadas, retornar dados vazios
    if (selectedCompanies.length === 0) {
      return []
    }

    // Create an object with all months initialized to zero for each company
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

    // Inicializar dados mensais para cada empresa
    const companiesData: Record<string, Record<MonthAbbr, number>> = {}
    selectedCompanies.forEach((company) => {
      companiesData[company] = { ...monthsTemplate }
    })

    // Group by month and calculate gross revenue for each company
    filteredData.forEach((item) => {
      // Apenas receitas do grupo RECEITA para empresas selecionadas
      if (item.GRUPO === "RECEITA" && selectedCompanies.includes(item.CIA)) {
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

        // Adicionar ao valor da empresa específica
        companiesData[item.CIA][monthAbbr] += Number(item.VALOR)
      }
    })

    // Define month order for sorting
    const monthOrder: MonthAbbr[] = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

    // Convert to array format for chart
    const result = monthOrder.map((month) => {
      const monthData: any = { month }

      // Adicionar dados de cada empresa
      selectedCompanies.forEach((company) => {
        monthData[company] = companiesData[company][month]
      })

      return monthData
    })

    return result
  }, [data, selectedCompanies, selectedYear, selectedMonths])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Encontrar o valor máximo considerando todas as empresas
  const maxRevenue = useMemo(() => {
    if (chartData.length === 0) return 0

    let max = 0
    chartData.forEach((item) => {
      selectedCompanies.forEach((company) => {
        if (item[company] > max) max = item[company]
      })
    })

    return max
  }, [chartData, selectedCompanies])

  // Gerar cores diferentes para cada empresa
  const companyColors = useMemo(() => {
    const colors = [
      "#4f46e5", // Azul (original)
      "#ef4444", // Vermelho
      "#10b981", // Verde
      "#f59e0b", // Âmbar
      "#8b5cf6", // Roxo
      "#ec4899", // Rosa
      "#06b6d4", // Ciano
      "#84cc16", // Lima
      "#f97316", // Laranja
      "#6366f1", // Índigo
    ]

    const result: Record<string, string> = {}
    selectedCompanies.forEach((company, index) => {
      result[company] = colors[index % colors.length]
    })

    return result
  }, [selectedCompanies])

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
            domain={[0, maxRevenue * 1.1]} // Add 10% padding to the top
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [formatCurrency(value), name]}
            labelFormatter={(label) => `Período: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "10px",
            }}
          />
          <Legend />

          {/* Renderizar uma barra para cada empresa */}
          {selectedCompanies.map((company) => (
            <Bar
              key={company}
              dataKey={company}
              name={company}
              fill={companyColors[company]}
              radius={[4, 4, 0, 0]}
              barSize={selectedCompanies.length > 1 ? 40 / selectedCompanies.length : 40}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

