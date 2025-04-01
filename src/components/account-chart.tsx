"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts"

// Definir tipo para os dados do gráfico
interface AccountData {
  name: string
  value: number
  originalValue: number
}

interface AccountChartProps {
  data: any[]
  selectedCompanies: string[]
  selectedYear: string
  selectedMonths: string[]
  selectedGroup: string
  selectedSubgroup: string
}

export function AccountChart({
  data,
  selectedCompanies,
  selectedYear,
  selectedMonths,
  selectedGroup,
  selectedSubgroup,
}: AccountChartProps) {
  const chartData = useMemo(() => {
    // Filter data by selected filters
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

    if (selectedSubgroup && selectedSubgroup !== "Todos") {
      filteredData = filteredData.filter((item) => item.SUBGRUPO === selectedSubgroup)
    }

    // Group by account name and calculate total values
    const accountData: Record<string, AccountData> = filteredData.reduce(
      (acc: Record<string, AccountData>, item: any) => {
        const accountName = item["NOME CONTA"] || "Sem nome"
        const accountCode = item["CÓD. CONTA"] || ""
        const displayName = accountCode ? `${accountCode} - ${accountName}` : accountName

        if (!acc[displayName]) {
          acc[displayName] = {
            name: displayName,
            value: 0,
            originalValue: 0,
          }
        }

        acc[displayName].originalValue += Number(item.VALOR)
        acc[displayName].value += Math.abs(Number(item.VALOR))

        return acc
      },
      {},
    )

    // Convert to array, sort by absolute value and limit to top 10
    return Object.values(accountData)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map((item) => ({
        name: item.name,
        value: item.originalValue,
      }))
  }, [data, selectedCompanies, selectedYear, selectedMonths, selectedGroup, selectedSubgroup])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Determine colors based on values
  const getBarColor = (value: number): string => {
    if (selectedGroup === "RECEITA") return "#4f46e5"
    if (selectedGroup === "DEDUCOES DE VENDAS") return "#f59e0b"
    if (selectedGroup === "DESPESA") return "#ef4444"
    return value >= 0 ? "#4f46e5" : "#ef4444"
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
        <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e0e0e0" />
          <XAxis
            type="number"
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={{ stroke: "#e0e0e0" }}
            width={140}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Valor"]}
            labelFormatter={(label) => `Conta: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "10px",
            }}
          />
          <Legend />
          <Bar dataKey="value" name="Valor" radius={[0, 4, 4, 0]} barSize={25}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

