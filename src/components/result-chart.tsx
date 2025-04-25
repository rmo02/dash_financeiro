"use client"

import { useMemo } from "react"
import {
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts"

// Modificar a definição do tipo MonthAbbr para garantir que todos os meses sejam reconhecidos corretamente
type MonthAbbr = "jan" | "fev" | "mar" | "abr" | "mai" | "jun" | "jul" | "ago" | "set" | "out" | "nov" | "dez"

interface ResultChartProps {
  data: any[]
  selectedCompanies: string[]
  selectedYear: string
  selectedMonths: string[]
}

export function ResultChart({ data, selectedCompanies, selectedYear, selectedMonths }: ResultChartProps) {
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

    // Inicializar dados mensais para cada empresa
    const companiesData: Record<
      string,
      Record<MonthAbbr, { revenue: number; deductions: number; expenses: number }>
    > = {}
    selectedCompanies.forEach((company) => {
      companiesData[company] = JSON.parse(JSON.stringify(monthsTemplate))
    })

    // Group by month and calculate revenue, deductions and expenses for each company
    filteredData.forEach((item) => {
      if (!selectedCompanies.includes(item.CIA)) return

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

      // Verificar se o mês é dezembro para tratamento especial
      const isDecember = monthIndex === 11
      const isPersonnelExpense = item.SUBGRUPO && item.SUBGRUPO.toUpperCase() === "DESPESA COM PESSOAL"

      if (item.GRUPO === "RECEITA") {
        companiesData[item.CIA][monthAbbr].revenue += Number(item.VALOR)
      } else if (item.GRUPO === "DEDUCOES DE VENDAS") {
        companiesData[item.CIA][monthAbbr].deductions += Number(item.VALOR) // Já é negativo
      } else if (item.GRUPO === "DESPESA") {
        // Verificar se é DESPESA COM PESSOAL em dezembro
        if (isDecember && isPersonnelExpense) {
          // Usar o valor considerando o sinal
          const valorAtual = Number(item.VALOR)
          // Se for negativo, usar o valor absoluto; se for positivo, usar o valor como está
          const valorAdicionar = valorAtual < 0 ? Math.abs(valorAtual) : valorAtual
          companiesData[item.CIA][monthAbbr].expenses += valorAdicionar
        } else {
          // Para outros casos, continuar usando o valor normal
          companiesData[item.CIA][monthAbbr].expenses += Number(item.VALOR) // Já é negativo
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
        const companyData = companiesData[company][month] || { revenue: 0, deductions: 0, expenses: 0 }
        // Calcular o resultado líquido para cada empresa
        monthData[company] = companyData.revenue + companyData.deductions + companyData.expenses
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

  // Encontrar os valores mínimo e máximo considerando todas as empresas
  const { minResult, maxResult } = useMemo(() => {
    if (chartData.length === 0) return { minResult: 0, maxResult: 0 }

    let min = 0
    let max = 0

    chartData.forEach((item) => {
      selectedCompanies.forEach((company) => {
        if (item[company] < min) min = item[company]
        if (item[company] > max) max = item[company]
      })
    })

    return { minResult: min, maxResult: max }
  }, [chartData, selectedCompanies])

  // Gerar cores diferentes para cada empresa
  const companyColors = useMemo(() => {
    const colors = [
      "#10b981", // Verde (original)
      "#4f46e5", // Azul
      "#ef4444", // Vermelho
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
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={60}
            tickMargin={20}
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={{ stroke: "#e0e0e0" }}
            tickFormatter={(value) => monthNames[value as MonthAbbr] || value}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            domain={[minResult * 1.1, maxResult * 1.1]} // Add 10% padding to both ends
            tick={{ fill: "#666", fontSize: 12 }}
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
          <Legend />
          <ReferenceLine y={0} stroke="#666" strokeWidth={1} />

          {/* Renderizar uma barra ou linha para cada empresa */}
          {selectedCompanies.map((company, index) =>
            selectedCompanies.length > 3 ? (
              // Usar linhas quando há muitas empresas para melhor visualização
              <Line
                key={company}
                type="monotone"
                dataKey={company}
                name={company}
                stroke={companyColors[company]}
                strokeWidth={2}
                dot={{ r: 4, fill: companyColors[company] }}
                activeDot={{ r: 6 }}
              />
            ) : (
              // Usar barras quando há poucas empresas
              <Bar
                key={company}
                dataKey={company}
                name={company}
                fill={companyColors[company]}
                radius={[4, 4, 0, 0]}
                barSize={selectedCompanies.length > 1 ? 40 / selectedCompanies.length : 40}
              />
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
