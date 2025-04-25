"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Modificar a definição do tipo MonthAbbr para garantir que todos os meses sejam reconhecidos corretamente
type MonthAbbr = "jan" | "fev" | "mar" | "abr" | "mai" | "jun" | "jul" | "ago" | "set" | "out" | "nov" | "dez"

// Atualizar a interface ExpensesChartProps para remover selectedGroups e selectedSubgroups
interface ExpensesChartProps {
  data: any[]
  selectedCompanies: string[]
  selectedYear: string
  selectedMonths: string[]
}

export function ExpensesChart({ data, selectedCompanies, selectedYear }: ExpensesChartProps) {
  // Modificar a parte do código que pode estar causando o erro, dentro da função useMemo
  const chartData = useMemo(() => {
    // Filter data by selected year only (ignore selectedMonths for this chart)
    let filteredData = [...data]

    if (selectedYear) {
      filteredData = filteredData.filter((item) => {
        const date = new Date(item.PERÍODO)
        return date.getUTCFullYear().toString() === selectedYear
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

    // Group by month and calculate expenses for each company
    filteredData.forEach((item) => {
      // Apenas despesas do grupo DESPESA para empresas selecionadas
      if (item.GRUPO === "DESPESA" && selectedCompanies.includes(item.CIA)) {
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

        // Verificar se é dezembro e o subgrupo é "DESPESA COM PESSOAL"
        const isDecember = monthIndex === 11
        const isPersonnelExpense = item.SUBGRUPO && item.SUBGRUPO.toUpperCase() === "DESPESA COM PESSOAL"

        if (isDecember && isPersonnelExpense) {
          // Usar o valor considerando o sinal
          const valorAtual = Number(item.VALOR)
          // Se for negativo, usar o valor absoluto; se for positivo, usar o valor como está
          const valorAdicionar = valorAtual < 0 ? Math.abs(valorAtual) : valorAtual
          companiesData[item.CIA][monthAbbr] += valorAdicionar
        } else {
          // Para outros casos, continuar usando o valor absoluto
          companiesData[item.CIA][monthAbbr] += Math.abs(Number(item.VALOR))
        }
      }
    })

    // Garantir que o array monthOrder inclua todos os meses na ordem correta
    const monthOrder: MonthAbbr[] = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

    // Certificar-se de que o resultado do chartData inclua todos os meses, mesmo sem dados
    const result = monthOrder.map((month) => {
      const monthData: any = { month }

      // Adicionar dados de cada empresa
      selectedCompanies.forEach((company) => {
        monthData[company] = companiesData[company][month] || 0
      })

      return monthData
    })

    return result
  }, [data, selectedCompanies, selectedYear]) // Removido selectedMonths da dependência

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Encontrar o valor máximo considerando todas as empresas
  const maxExpense = useMemo(() => {
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
      "#ef4444", // Vermelho (original)
      "#4f46e5", // Azul
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

  // Mapeamento de abreviações para nomes completos dos meses
  const monthNames: Record<MonthAbbr, string> = {
    jan: "Janeiro",
    fev: "Fevereiro",
    mar: "Março",
    abr: "Abril",
    mai: "Maio",
    jun: "Junho",
    jul: "Julho",
    ago: "Agosto",
    set: "Setembro",
    out: "Outubro",
    nov: "Novembro",
    dez: "Dezembro",
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
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={60}
            tickMargin={20}
            tick={{ fill: "#666", fontSize: 10 }}
            axisLine={{ stroke: "#e0e0e0" }}
            tickFormatter={(value) => monthNames[value as MonthAbbr] || value}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            domain={[0, maxExpense * 1.1]} // Add 10% padding to the top
            tick={{ fill: "#666", fontSize: 10 }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [formatCurrency(value), name]}
            labelFormatter={(label) =>
              `${monthNames[label as MonthAbbr] || label}${selectedYear ? ` de ${selectedYear}` : ""}`
            }
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "10px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />

          {/* Renderizar uma barra para cada empresa */}
          {selectedCompanies.map((company, _index) => (
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
