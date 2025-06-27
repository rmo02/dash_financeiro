import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowDownIcon, ArrowUpIcon, TrendingDownIcon, TrendingUpIcon, InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface CompanyMetrics {
  grossRevenue: number
  deductions: number
  netRevenue: number
  expenses: number
  netResult: number
  netMargin: number
}

interface FinancialMetricsProps {
  metrics: {
    grossRevenue: number
    deductions: number
    netRevenue: number
    expenses: number
    netResult: number
    netMargin: number
  }
  selectedCompanies: string[]
  companyMetrics?: Record<string, CompanyMetrics>
  selectedGroups?: string[]
  selectedSubgroups?: string[]
  filteredData?: any[] // Adicionar dados filtrados para calcular breakdowns
}

export function FinancialMetrics({
  metrics,
  selectedCompanies = [],
  companyMetrics = {},
  selectedGroups = [],
  selectedSubgroups = [],
  filteredData = [],
}: FinancialMetricsProps) {
  const { grossRevenue, deductions, netRevenue, expenses, netResult, netMargin } = metrics

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Função para calcular breakdown da receita bruta (principais subgrupos)
  const getRevenueBreakdown = () => {
    const revenueData = filteredData.filter((item) => item.GRUPO === "RECEITA")
    const subgroupTotals: Record<string, number> = {}

    revenueData.forEach((item) => {
      const subgroup = item.SUBGRUPO || "Outros"
      subgroupTotals[subgroup] = (subgroupTotals[subgroup] || 0) + Number(item.VALOR)
    })

    // Ordenar por valor e pegar os top 3
    const sortedSubgroups = Object.entries(subgroupTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    return sortedSubgroups.map(([label, value]) => ({ label, value }))
  }

  // Função para calcular breakdown das deduções
  const getDeductionsBreakdown = () => {
    const deductionsData = filteredData.filter((item) => item.GRUPO === "DEDUCOES DE VENDAS")
    const subgroupTotals: Record<string, number> = {}

    deductionsData.forEach((item) => {
      const subgroup = item.SUBGRUPO || "Outros"
      subgroupTotals[subgroup] = (subgroupTotals[subgroup] || 0) + Math.abs(Number(item.VALOR))
    })

    // Ordenar por valor e pegar os top 3
    const sortedSubgroups = Object.entries(subgroupTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    return sortedSubgroups.map(([label, value]) => ({ label, value }))
  }

  // Função para calcular breakdown da receita líquida
  const getNetRevenueBreakdown = () => {
    return [
      { label: "Receita Bruta", value: grossRevenue },
      { label: "Deduções", value: deductions, isSubtraction: true },
    ]
  }

  // Função para calcular breakdown das despesas
  const getExpensesBreakdown = () => {
    const expensesData = filteredData.filter((item) => item.GRUPO === "DESPESA")
    const subgroupTotals: Record<string, number> = {}

    expensesData.forEach((item) => {
      const subgroup = item.SUBGRUPO || "Outros"
      const date = new Date(item.PERÍODO)
      const isDecember = date.getUTCMonth() === 11
      const isPersonnelExpense = item.SUBGRUPO && item.SUBGRUPO.toUpperCase() === "DESPESA COM PESSOAL"

      let valueToAdd = 0
      if (isDecember && isPersonnelExpense) {
        const valorAtual = Number(item.VALOR)
        valueToAdd = valorAtual < 0 ? Math.abs(valorAtual) : valorAtual
      } else {
        valueToAdd = Math.abs(Number(item.VALOR))
      }

      subgroupTotals[subgroup] = (subgroupTotals[subgroup] || 0) + valueToAdd
    })

    // Ordenar por valor e pegar os top 3
    const sortedSubgroups = Object.entries(subgroupTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    return sortedSubgroups.map(([label, value]) => ({ label, value }))
  }

  // Função para calcular breakdown do resultado líquido
  const getNetResultBreakdown = () => {
    return [
      { label: "Receita Líquida", value: netRevenue },
      { label: "Despesas", value: Math.abs(expenses), isSubtraction: true },
    ]
  }

  // Função para calcular breakdown da margem líquida
  const getNetMarginBreakdown = () => {
    return [
      { label: `Resultado: ${formatCurrency(netResult)}`, value: netResult },
      { label: `÷ Rec. Líquida: ${formatCurrency(Math.abs(netRevenue))}`, value: Math.abs(netRevenue) },
    ]
  }

  // Determinar se devemos mostrar métricas por empresa ou métricas consolidadas
  const showCompanyMetrics = selectedCompanies?.length > 1 && Object.keys(companyMetrics || {}).length > 0

  // Função para gerar tooltips dinâmicos baseados nas seleções
  const getDynamicTooltip = (metricType: string) => {
    switch (metricType) {
      case "grossRevenue":
        return selectedGroups.length > 0 && selectedGroups.includes("RECEITA")
          ? `Soma dos valores ${
              selectedSubgroups.length > 0
                ? `dos subgrupos selecionados (${selectedSubgroups.join(", ")})`
                : "de todos os subgrupos"
            } do grupo RECEITA.`
          : "Soma de todos os valores do grupo RECEITA, representando o total de receitas antes das deduções."
      case "deductions":
        return selectedGroups.length > 0 && selectedGroups.includes("DEDUCOES DE VENDAS")
          ? `Soma do valor absoluto dos valores ${
              selectedSubgroups.length > 0
                ? `dos subgrupos selecionados (${selectedSubgroups.join(", ")})`
                : "de todos os subgrupos"
            } do grupo DEDUCOES DE VENDAS.`
          : "Soma do valor absoluto de todos os valores do grupo DEDUCOES DE VENDAS, incluindo impostos e outras deduções."
      case "netRevenue":
        return "Calculada como Receita Bruta + Deduções (as deduções já são valores negativos), representando o valor efetivo após deduções."
      case "expenses":
        return selectedGroups.length > 0 && selectedGroups.includes("DESPESA")
          ? `Soma do valor absoluto dos valores ${
              selectedSubgroups.length > 0
                ? `dos subgrupos selecionados (${selectedSubgroups.join(", ")})`
                : "de todos os subgrupos"
            } do grupo DESPESA.`
          : "Soma do valor absoluto de todos os valores do grupo DESPESA, incluindo despesas operacionais, financeiras e administrativas."
      case "netResult":
        return `Calculado como Receita Líquida - Despesas, representando o lucro ou prejuízo final após todas as receitas e despesas${
          selectedGroups.length > 0 || selectedSubgroups.length > 0 ? `, considerando os filtros selecionados.` : "."
        }`
      case "netMargin":
        return `Calculada como (Resultado Líquido / Receita Líquida) × 100, representando a porcentagem de lucro em relação à receita${
          selectedGroups.length > 0 || selectedSubgroups.length > 0 ? `, considerando os filtros selecionados.` : "."
        }`
      default:
        return ""
    }
  }

  return (
    <TooltipProvider>
      {showCompanyMetrics ? (
        // Mostrar métricas separadas por empresa
        <div className="space-y-4 sm:space-y-6">
          {/* Métricas consolidadas */}
          <div>
            <h3 className="text-lg font-semibold mb-2 sm:mb-3 text-slate-700">Métricas Consolidadas</h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              <MetricCard
                title="Receita Bruta"
                value={grossRevenue}
                description="Total de receitas antes das deduções"
                tooltipText={getDynamicTooltip("grossRevenue")}
                icon={<TrendingUpIcon className="h-5 w-5 text-blue-600" />}
                iconBgColor="bg-blue-100"
                titleColor="text-blue-700"
                tooltipIconColor="text-blue-400"
                gradientColor="from-white to-blue-50"
                borderColor="bg-blue-500"
                breakdown={getRevenueBreakdown()}
              />
              <MetricCard
                title="Deduções"
                value={deductions}
                description="Impostos e outras deduções"
                tooltipText={getDynamicTooltip("deductions")}
                icon={<TrendingDownIcon className="h-5 w-5 text-amber-600" />}
                iconBgColor="bg-amber-100"
                titleColor="text-amber-700"
                tooltipIconColor="text-amber-400"
                gradientColor="from-white to-amber-50"
                borderColor="bg-amber-500"
                breakdown={getDeductionsBreakdown()}
              />
              <MetricCard
                title="Receita Líquida"
                value={netRevenue}
                description="Receita bruta menos deduções"
                tooltipText={getDynamicTooltip("netRevenue")}
                icon={<TrendingUpIcon className="h-5 w-5 text-indigo-600" />}
                iconBgColor="bg-indigo-100"
                titleColor="text-indigo-700"
                tooltipIconColor="text-indigo-400"
                gradientColor="from-white to-indigo-50"
                borderColor="bg-indigo-500"
                breakdown={getNetRevenueBreakdown()}
              />
              <MetricCard
                title="Despesas"
                value={expenses}
                description="Total de gastos operacionais"
                tooltipText={getDynamicTooltip("expenses")}
                icon={<TrendingDownIcon className="h-5 w-5 text-red-600" />}
                iconBgColor="bg-red-100"
                titleColor="text-red-700"
                tooltipIconColor="text-red-400"
                gradientColor="from-white to-red-50"
                borderColor="bg-red-500"
                breakdown={getExpensesBreakdown()}
              />
              <MetricCard
                title="Resultado Líquido"
                value={netResult}
                description="Receita líquida menos despesas"
                tooltipText={getDynamicTooltip("netResult")}
                icon={
                  netResult >= 0 ? (
                    <ArrowUpIcon className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5 text-red-600" />
                  )
                }
                iconBgColor={netResult >= 0 ? "bg-emerald-100" : "bg-red-100"}
                titleColor={netResult >= 0 ? "text-emerald-700" : "text-red-700"}
                tooltipIconColor={netResult >= 0 ? "text-emerald-400" : "text-red-400"}
                gradientColor={netResult >= 0 ? "from-white to-emerald-50" : "from-white to-red-50"}
                borderColor={netResult >= 0 ? "bg-emerald-500" : "bg-red-500"}
                breakdown={getNetResultBreakdown()}
              />
              <MetricCard
                title="Margem Líquida"
                value={netMargin}
                description="Percentual do resultado sobre a receita"
                tooltipText={getDynamicTooltip("netMargin")}
                icon={
                  netMargin >= 0 ? (
                    <ArrowUpIcon className="h-5 w-5 text-purple-600" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5 text-red-600" />
                  )
                }
                iconBgColor={netMargin >= 0 ? "bg-purple-100" : "bg-red-100"}
                titleColor={netMargin >= 0 ? "text-purple-700" : "text-red-700"}
                tooltipIconColor={netMargin >= 0 ? "text-purple-400" : "text-red-400"}
                gradientColor={netMargin >= 0 ? "from-white to-purple-50" : "from-white to-red-50"}
                borderColor={netMargin >= 0 ? "bg-purple-500" : "bg-red-500"}
                isPercentage={true}
                breakdown={getNetMarginBreakdown()}
              />
            </div>
          </div>

          {/* Métricas por empresa */}
          {selectedCompanies.map((company) => {
            const companyMetric = companyMetrics[company] || {
              grossRevenue: 0,
              deductions: 0,
              netRevenue: 0,
              expenses: 0,
              netResult: 0,
              netMargin: 0,
            }

            // Filtrar dados para esta empresa específica para calcular breakdowns
            const companyData = filteredData.filter((item) => item.CIA === company)

            const getCompanyRevenueBreakdown = () => {
              const revenueData = companyData.filter((item) => item.GRUPO === "RECEITA")
              const subgroupTotals: Record<string, number> = {}

              revenueData.forEach((item) => {
                const subgroup = item.SUBGRUPO || "Outros"
                subgroupTotals[subgroup] = (subgroupTotals[subgroup] || 0) + Number(item.VALOR)
              })

              const sortedSubgroups = Object.entries(subgroupTotals)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)

              return sortedSubgroups.map(([label, value]) => ({ label, value }))
            }

            const getCompanyDeductionsBreakdown = () => {
              const deductionsData = companyData.filter((item) => item.GRUPO === "DEDUCOES DE VENDAS")
              const subgroupTotals: Record<string, number> = {}

              deductionsData.forEach((item) => {
                const subgroup = item.SUBGRUPO || "Outros"
                subgroupTotals[subgroup] = (subgroupTotals[subgroup] || 0) + Math.abs(Number(item.VALOR))
              })

              const sortedSubgroups = Object.entries(subgroupTotals)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)

              return sortedSubgroups.map(([label, value]) => ({ label, value }))
            }

            const getCompanyExpensesBreakdown = () => {
              const expensesData = companyData.filter((item) => item.GRUPO === "DESPESA")
              const subgroupTotals: Record<string, number> = {}

              expensesData.forEach((item) => {
                const subgroup = item.SUBGRUPO || "Outros"
                const date = new Date(item.PERÍODO)
                const isDecember = date.getUTCMonth() === 11
                const isPersonnelExpense = item.SUBGRUPO && item.SUBGRUPO.toUpperCase() === "DESPESA COM PESSOAL"

                let valueToAdd = 0
                if (isDecember && isPersonnelExpense) {
                  const valorAtual = Number(item.VALOR)
                  valueToAdd = valorAtual < 0 ? Math.abs(valorAtual) : valorAtual
                } else {
                  valueToAdd = Math.abs(Number(item.VALOR))
                }

                subgroupTotals[subgroup] = (subgroupTotals[subgroup] || 0) + valueToAdd
              })

              const sortedSubgroups = Object.entries(subgroupTotals)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)

              return sortedSubgroups.map(([label, value]) => ({ label, value }))
            }

            return (
              <div key={company}>
                <h3 className="text-lg font-semibold mb-3 text-slate-700">{company}</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <MetricCard
                    title="Receita Bruta"
                    value={companyMetric.grossRevenue}
                    description="Total de receitas antes das deduções"
                    tooltipText={getDynamicTooltip("grossRevenue")}
                    icon={<TrendingUpIcon className="h-5 w-5 text-blue-600" />}
                    iconBgColor="bg-blue-100"
                    titleColor="text-blue-700"
                    tooltipIconColor="text-blue-400"
                    gradientColor="from-white to-blue-50"
                    borderColor="bg-blue-500"
                    breakdown={getCompanyRevenueBreakdown()}
                  />
                  <MetricCard
                    title="Deduções"
                    value={companyMetric.deductions}
                    description="Impostos e outras deduções"
                    tooltipText={getDynamicTooltip("deductions")}
                    icon={<TrendingDownIcon className="h-5 w-5 text-amber-600" />}
                    iconBgColor="bg-amber-100"
                    titleColor="text-amber-700"
                    tooltipIconColor="text-amber-400"
                    gradientColor="from-white to-amber-50"
                    borderColor="bg-amber-500"
                    breakdown={getCompanyDeductionsBreakdown()}
                  />
                  <MetricCard
                    title="Receita Líquida"
                    value={companyMetric.netRevenue}
                    description="Receita bruta menos deduções"
                    tooltipText={getDynamicTooltip("netRevenue")}
                    icon={<TrendingUpIcon className="h-5 w-5 text-indigo-600" />}
                    iconBgColor="bg-indigo-100"
                    titleColor="text-indigo-700"
                    tooltipIconColor="text-indigo-400"
                    gradientColor="from-white to-indigo-50"
                    borderColor="bg-indigo-500"
                    breakdown={[
                      { label: "Receita Bruta", value: companyMetric.grossRevenue },
                      { label: "Deduções", value: companyMetric.deductions, isSubtraction: true },
                    ]}
                  />
                  <MetricCard
                    title="Despesas"
                    value={companyMetric.expenses}
                    description="Total de gastos operacionais"
                    tooltipText={getDynamicTooltip("expenses")}
                    icon={<TrendingDownIcon className="h-5 w-5 text-red-600" />}
                    iconBgColor="bg-red-100"
                    titleColor="text-red-700"
                    tooltipIconColor="text-red-400"
                    gradientColor="from-white to-red-50"
                    borderColor="bg-red-500"
                    breakdown={getCompanyExpensesBreakdown()}
                  />
                  <MetricCard
                    title="Resultado Líquido"
                    value={companyMetric.netResult}
                    description="Receita líquida menos despesas"
                    tooltipText={getDynamicTooltip("netResult")}
                    icon={
                      companyMetric.netResult >= 0 ? (
                        <ArrowUpIcon className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <ArrowDownIcon className="h-5 w-5 text-red-600" />
                      )
                    }
                    iconBgColor={companyMetric.netResult >= 0 ? "bg-emerald-100" : "bg-red-100"}
                    titleColor={companyMetric.netResult >= 0 ? "text-emerald-700" : "text-red-700"}
                    tooltipIconColor={companyMetric.netResult >= 0 ? "text-emerald-400" : "text-red-400"}
                    gradientColor={companyMetric.netResult >= 0 ? "from-white to-emerald-50" : "from-white to-red-50"}
                    borderColor={companyMetric.netResult >= 0 ? "bg-emerald-500" : "bg-red-500"}
                    breakdown={[
                      { label: "Receita Líquida", value: companyMetric.netRevenue },
                      { label: "Despesas", value: Math.abs(companyMetric.expenses), isSubtraction: true },
                    ]}
                  />
                  <MetricCard
                    title="Margem Líquida"
                    value={companyMetric.netMargin}
                    description="Percentual do resultado sobre a receita"
                    tooltipText={getDynamicTooltip("netMargin")}
                    icon={
                      companyMetric.netMargin >= 0 ? (
                        <ArrowUpIcon className="h-5 w-5 text-purple-600" />
                      ) : (
                        <ArrowDownIcon className="h-5 w-5 text-red-600" />
                      )
                    }
                    iconBgColor={companyMetric.netMargin >= 0 ? "bg-purple-100" : "bg-red-100"}
                    titleColor={companyMetric.netMargin >= 0 ? "text-purple-700" : "text-red-700"}
                    tooltipIconColor={companyMetric.netMargin >= 0 ? "text-purple-400" : "text-red-400"}
                    gradientColor={companyMetric.netMargin >= 0 ? "from-white to-purple-50" : "from-white to-red-50"}
                    borderColor={companyMetric.netMargin >= 0 ? "bg-purple-500" : "bg-red-500"}
                    isPercentage={true}
                    breakdown={[
                      {
                        label: `Resultado: ${formatCurrency(companyMetric.netResult)}`,
                        value: companyMetric.netResult,
                      },
                      {
                        label: `÷ Rec. Líquida: ${formatCurrency(Math.abs(companyMetric.netRevenue))}`,
                        value: Math.abs(companyMetric.netRevenue),
                      },
                    ]}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // Mostrar apenas métricas consolidadas (original)
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          <MetricCard
            title="Receita Bruta"
            value={grossRevenue}
            description="Total de receitas antes das deduções"
            tooltipText={getDynamicTooltip("grossRevenue")}
            icon={<TrendingUpIcon className="h-5 w-5 text-blue-600" />}
            iconBgColor="bg-blue-100"
            titleColor="text-blue-700"
            tooltipIconColor="text-blue-400"
            gradientColor="from-white to-blue-50"
            borderColor="bg-blue-500"
            breakdown={getRevenueBreakdown()}
          />
          <MetricCard
            title="Deduções"
            value={deductions}
            description="Impostos e outras deduções"
            tooltipText={getDynamicTooltip("deductions")}
            icon={<TrendingDownIcon className="h-5 w-5 text-amber-600" />}
            iconBgColor="bg-amber-100"
            titleColor="text-amber-700"
            tooltipIconColor="text-amber-400"
            gradientColor="from-white to-amber-50"
            borderColor="bg-amber-500"
            breakdown={getDeductionsBreakdown()}
          />
          <MetricCard
            title="Receita Líquida"
            value={netRevenue}
            description="Receita bruta menos deduções"
            tooltipText={getDynamicTooltip("netRevenue")}
            icon={<TrendingUpIcon className="h-5 w-5 text-indigo-600" />}
            iconBgColor="bg-indigo-100"
            titleColor="text-indigo-700"
            tooltipIconColor="text-indigo-400"
            gradientColor="from-white to-indigo-50"
            borderColor="bg-indigo-500"
            breakdown={getNetRevenueBreakdown()}
          />
          <MetricCard
            title="Despesas"
            value={expenses}
            description="Total de gastos operacionais"
            tooltipText={getDynamicTooltip("expenses")}
            icon={<TrendingDownIcon className="h-5 w-5 text-red-600" />}
            iconBgColor="bg-red-100"
            titleColor="text-red-700"
            tooltipIconColor="text-red-400"
            gradientColor="from-white to-red-50"
            borderColor="bg-red-500"
            breakdown={getExpensesBreakdown()}
          />
          <MetricCard
            title="Resultado Líquido"
            value={netResult}
            description="Receita líquida menos despesas"
            tooltipText={getDynamicTooltip("netResult")}
            icon={
              netResult >= 0 ? (
                <ArrowUpIcon className="h-5 w-5 text-emerald-600" />
              ) : (
                <ArrowDownIcon className="h-5 w-5 text-red-600" />
              )
            }
            iconBgColor={netResult >= 0 ? "bg-emerald-100" : "bg-red-100"}
            titleColor={netResult >= 0 ? "text-emerald-700" : "text-red-700"}
            tooltipIconColor={netResult >= 0 ? "text-emerald-400" : "text-red-400"}
            gradientColor={netResult >= 0 ? "from-white to-emerald-50" : "from-white to-red-50"}
            borderColor={netResult >= 0 ? "bg-emerald-500" : "bg-red-500"}
            breakdown={getNetResultBreakdown()}
          />
          <MetricCard
            title="Margem Líquida"
            value={netMargin}
            description="Percentual do resultado sobre a receita"
            tooltipText={getDynamicTooltip("netMargin")}
            icon={
              netMargin >= 0 ? (
                <ArrowUpIcon className="h-5 w-5 text-purple-600" />
              ) : (
                <ArrowDownIcon className="h-5 w-5 text-red-600" />
              )
            }
            iconBgColor={netMargin >= 0 ? "bg-purple-100" : "bg-red-100"}
            titleColor={netMargin >= 0 ? "text-purple-700" : "text-red-700"}
            tooltipIconColor={netMargin >= 0 ? "text-purple-400" : "text-red-400"}
            gradientColor={netMargin >= 0 ? "from-white to-purple-50" : "from-white to-red-50"}
            borderColor={netMargin >= 0 ? "bg-purple-500" : "bg-red-500"}
            isPercentage={true}
            breakdown={getNetMarginBreakdown()}
          />
        </div>
      )}
    </TooltipProvider>
  )
}

// Componente de card de métrica reutilizável
interface MetricCardProps {
  title: string
  value: number
  description: string
  tooltipText: string
  icon: React.ReactNode
  iconBgColor: string
  titleColor: string
  tooltipIconColor: string
  gradientColor: string
  borderColor: string
  isPercentage?: boolean
  breakdown?: Array<{ label: string; value: number; isSubtraction?: boolean }>
}

function MetricCard({
  title,
  value,
  description,
  tooltipText,
  icon,
  iconBgColor,
  titleColor,
  tooltipIconColor,
  gradientColor,
  borderColor,
  isPercentage = false,
  breakdown = [],
}: MetricCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Determinar se devemos mostrar o valor absoluto ou o valor real
  const displayValue = title === "Despesas" ? Math.abs(value) : value
  // Determinar se o valor é negativo para estilização
  const isNegative = value < 0 && title !== "Despesas" // Despesas são naturalmente negativas

  return (
    <Card
      className={`overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${gradientColor}`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${borderColor}`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
        <CardTitle className={`text-xs sm:text-sm font-medium ${titleColor} flex items-center gap-1 sm:gap-1.5`}>
          {title}
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${tooltipIconColor} cursor-help`} />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-white shadow-lg border border-gray-100 p-3 rounded-lg text-gray-700">
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
        <div
          className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full ${iconBgColor} p-1 sm:p-1.5 flex items-center justify-center`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-4 px-3 sm:px-4 pb-3 sm:pb-4">
        <div
          className={`text-base sm:text-xl md:text-2xl font-bold ${isNegative ? "text-red-600" : "text-slate-800"} truncate`}
        >
          {isPercentage ? `${value.toFixed(2)}%` : formatCurrency(displayValue)}
          {isNegative && !isPercentage && " (negativo)"}
        </div>

        {/* Breakdown dos valores */}
        {breakdown.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="space-y-1">
              {breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 truncate mr-2 max-w-[60%]">{item.label}</span>
                  <span className={`font-medium ${item.isSubtraction ? "text-red-600" : "text-slate-700"} text-right`}>
                    {item.isSubtraction && item.value > 0 ? "-" : ""}
                    {item.label.includes("÷") || item.label.includes("×") ? "" : formatCurrency(Math.abs(item.value))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>
      </CardContent>
    </Card>
  )
}

