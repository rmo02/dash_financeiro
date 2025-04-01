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
}

export function FinancialMetrics({ metrics, selectedCompanies = [], companyMetrics = {} }: FinancialMetricsProps) {
  const { grossRevenue, deductions, netRevenue, expenses, netResult, netMargin } = metrics

  // Determinar se devemos mostrar métricas por empresa ou métricas consolidadas
  const showCompanyMetrics = selectedCompanies?.length > 1 && Object.keys(companyMetrics || {}).length > 0

  return (
    <TooltipProvider>
      {showCompanyMetrics ? (
        // Mostrar métricas separadas por empresa
        <div className="space-y-6">
          {/* Métricas consolidadas */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-700">Métricas Consolidadas</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <MetricCard
                title="Receita Bruta"
                value={grossRevenue}
                description="Total de receitas antes das deduções"
                tooltipText="Soma de todos os valores do grupo RECEITA, representando o total de receitas antes das deduções."
                icon={<TrendingUpIcon className="h-5 w-5 text-blue-600" />}
                iconBgColor="bg-blue-100"
                titleColor="text-blue-700"
                tooltipIconColor="text-blue-400"
                gradientColor="from-white to-blue-50"
                borderColor="bg-blue-500"
              />
              <MetricCard
                title="Deduções"
                value={deductions}
                description="Impostos e outras deduções"
                tooltipText="Soma do valor absoluto de todos os valores do grupo DEDUCOES DE VENDAS, incluindo impostos e outras deduções."
                icon={<TrendingDownIcon className="h-5 w-5 text-amber-600" />}
                iconBgColor="bg-amber-100"
                titleColor="text-amber-700"
                tooltipIconColor="text-amber-400"
                gradientColor="from-white to-amber-50"
                borderColor="bg-amber-500"
              />
              <MetricCard
                title="Receita Líquida"
                value={netRevenue}
                description="Receita bruta menos deduções"
                tooltipText="Calculada como Receita Bruta + Deduções (as deduções já são valores negativos), representando o valor efetivo após deduções."
                icon={<TrendingUpIcon className="h-5 w-5 text-indigo-600" />}
                iconBgColor="bg-indigo-100"
                titleColor="text-indigo-700"
                tooltipIconColor="text-indigo-400"
                gradientColor="from-white to-indigo-50"
                borderColor="bg-indigo-500"
              />
              <MetricCard
                title="Despesas"
                value={expenses}
                description="Total de gastos operacionais"
                tooltipText="Soma do valor absoluto de todos os valores do grupo DESPESA, incluindo despesas operacionais, financeiras e administrativas."
                icon={<TrendingDownIcon className="h-5 w-5 text-red-600" />}
                iconBgColor="bg-red-100"
                titleColor="text-red-700"
                tooltipIconColor="text-red-400"
                gradientColor="from-white to-red-50"
                borderColor="bg-red-500"
              />
              <MetricCard
                title="Resultado Líquido"
                value={netResult}
                description="Receita líquida menos despesas"
                tooltipText="Calculado como Receita Líquida - Despesas, representando o lucro ou prejuízo final após todas as receitas e despesas."
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
              />
              <MetricCard
                title="Margem Líquida"
                value={netMargin}
                description="Percentual do resultado sobre a receita"
                tooltipText="Calculada como (Resultado Líquido / Receita Líquida) × 100, representando a porcentagem de lucro em relação à receita."
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

            return (
              <div key={company}>
                <h3 className="text-lg font-semibold mb-3 text-slate-700">{company}</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <MetricCard
                    title="Receita Bruta"
                    value={companyMetric.grossRevenue}
                    description="Total de receitas antes das deduções"
                    tooltipText="Soma de todos os valores do grupo RECEITA, representando o total de receitas antes das deduções."
                    icon={<TrendingUpIcon className="h-5 w-5 text-blue-600" />}
                    iconBgColor="bg-blue-100"
                    titleColor="text-blue-700"
                    tooltipIconColor="text-blue-400"
                    gradientColor="from-white to-blue-50"
                    borderColor="bg-blue-500"
                  />
                  <MetricCard
                    title="Deduções"
                    value={companyMetric.deductions}
                    description="Impostos e outras deduções"
                    tooltipText="Soma do valor absoluto de todos os valores do grupo DEDUCOES DE VENDAS, incluindo impostos e outras deduções."
                    icon={<TrendingDownIcon className="h-5 w-5 text-amber-600" />}
                    iconBgColor="bg-amber-100"
                    titleColor="text-amber-700"
                    tooltipIconColor="text-amber-400"
                    gradientColor="from-white to-amber-50"
                    borderColor="bg-amber-500"
                  />
                  <MetricCard
                    title="Receita Líquida"
                    value={companyMetric.netRevenue}
                    description="Receita bruta menos deduções"
                    tooltipText="Calculada como Receita Bruta + Deduções (as deduções já são valores negativos), representando o valor efetivo após deduções."
                    icon={<TrendingUpIcon className="h-5 w-5 text-indigo-600" />}
                    iconBgColor="bg-indigo-100"
                    titleColor="text-indigo-700"
                    tooltipIconColor="text-indigo-400"
                    gradientColor="from-white to-indigo-50"
                    borderColor="bg-indigo-500"
                  />
                  <MetricCard
                    title="Despesas"
                    value={companyMetric.expenses}
                    description="Total de gastos operacionais"
                    tooltipText="Soma do valor absoluto de todos os valores do grupo DESPESA, incluindo despesas operacionais, financeiras e administrativas."
                    icon={<TrendingDownIcon className="h-5 w-5 text-red-600" />}
                    iconBgColor="bg-red-100"
                    titleColor="text-red-700"
                    tooltipIconColor="text-red-400"
                    gradientColor="from-white to-red-50"
                    borderColor="bg-red-500"
                  />
                  <MetricCard
                    title="Resultado Líquido"
                    value={companyMetric.netResult}
                    description="Receita líquida menos despesas"
                    tooltipText="Calculado como Receita Líquida - Despesas, representando o lucro ou prejuízo final após todas as receitas e despesas."
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
                  />
                  <MetricCard
                    title="Margem Líquida"
                    value={companyMetric.netMargin}
                    description="Percentual do resultado sobre a receita"
                    tooltipText="Calculada como (Resultado Líquido / Receita Líquida) × 100, representando a porcentagem de lucro em relação à receita."
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
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // Mostrar apenas métricas consolidadas (original)
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            title="Receita Bruta"
            value={grossRevenue}
            description="Total de receitas antes das deduções"
            tooltipText="Soma de todos os valores do grupo RECEITA, representando o total de receitas antes das deduções."
            icon={<TrendingUpIcon className="h-5 w-5 text-blue-600" />}
            iconBgColor="bg-blue-100"
            titleColor="text-blue-700"
            tooltipIconColor="text-blue-400"
            gradientColor="from-white to-blue-50"
            borderColor="bg-blue-500"
          />
          <MetricCard
            title="Deduções"
            value={deductions}
            description="Impostos e outras deduções"
            tooltipText="Soma do valor absoluto de todos os valores do grupo DEDUCOES DE VENDAS, incluindo impostos e outras deduções."
            icon={<TrendingDownIcon className="h-5 w-5 text-amber-600" />}
            iconBgColor="bg-amber-100"
            titleColor="text-amber-700"
            tooltipIconColor="text-amber-400"
            gradientColor="from-white to-amber-50"
            borderColor="bg-amber-500"
          />
          <MetricCard
            title="Receita Líquida"
            value={netRevenue}
            description="Receita bruta menos deduções"
            tooltipText="Calculada como Receita Bruta + Deduções (as deduções já são valores negativos), representando o valor efetivo após deduções."
            icon={<TrendingUpIcon className="h-5 w-5 text-indigo-600" />}
            iconBgColor="bg-indigo-100"
            titleColor="text-indigo-700"
            tooltipIconColor="text-indigo-400"
            gradientColor="from-white to-indigo-50"
            borderColor="bg-indigo-500"
          />
          <MetricCard
            title="Despesas"
            value={expenses}
            description="Total de gastos operacionais"
            tooltipText="Soma do valor absoluto de todos os valores do grupo DESPESA, incluindo despesas operacionais, financeiras e administrativas."
            icon={<TrendingDownIcon className="h-5 w-5 text-red-600" />}
            iconBgColor="bg-red-100"
            titleColor="text-red-700"
            tooltipIconColor="text-red-400"
            gradientColor="from-white to-red-50"
            borderColor="bg-red-500"
          />
          <MetricCard
            title="Resultado Líquido"
            value={netResult}
            description="Receita líquida menos despesas"
            tooltipText="Calculado como Receita Líquida - Despesas, representando o lucro ou prejuízo final após todas as receitas e despesas."
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
          />
          <MetricCard
            title="Margem Líquida"
            value={netMargin}
            description="Percentual do resultado sobre a receita"
            tooltipText="Calculada como (Resultado Líquido / Receita Líquida) × 100, representando a porcentagem de lucro em relação à receita."
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
}: MetricCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Card
      className={`overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${gradientColor}`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${borderColor}`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${titleColor} flex items-center gap-1.5`}>
          {title}
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className={`h-4 w-4 ${tooltipIconColor} cursor-help`} />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
        <div className={`h-8 w-8 rounded-full ${iconBgColor} p-1.5 flex items-center justify-center`}>{icon}</div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold text-slate-800">
          {isPercentage ? `${value.toFixed(2)}%` : formatCurrency(value)}
        </div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

