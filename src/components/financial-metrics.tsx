import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowDownIcon, ArrowUpIcon, TrendingDownIcon, TrendingUpIcon, InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface FinancialMetricsProps {
  metrics: {
    grossRevenue: number
    deductions: number
    netRevenue: number
    expenses: number
    netResult: number
    netMargin: number
  }
}

export function FinancialMetrics({ metrics }: FinancialMetricsProps) {
  const { grossRevenue, deductions, netRevenue, expenses, netResult, netMargin } = metrics

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Receita Bruta */}
        <Card className="overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-1.5">
              Receita Bruta
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-blue-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-white text-gray-950 shadow-xl p-2 font-medium">
                  <p>
                    Soma de todos os valores do grupo RECEITA, representando o total de receitas antes das deduções.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 p-1.5 flex items-center justify-center">
              <TrendingUpIcon className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(grossRevenue)}</div>
            <p className="text-xs text-slate-500 mt-1">Total de receitas antes das deduções</p>
          </CardContent>
        </Card>

        {/* Deduções */}
        <Card className="overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-amber-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-1.5">
              Deduções
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-amber-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-white text-gray-950 shadow-xl p-2 font-medium">
                  <p>
                    Soma do valor absoluto de todos os valores do grupo DEDUCOES DE VENDAS, incluindo impostos e outras
                    deduções.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 p-1.5 flex items-center justify-center">
              <TrendingDownIcon className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(deductions)}</div>
            <p className="text-xs text-slate-500 mt-1">Impostos e outras deduções</p>
          </CardContent>
        </Card>

        {/* Receita Líquida */}
        <Card className="overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-indigo-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700 flex items-center gap-1.5">
              Receita Líquida
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-indigo-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-white text-gray-950 shadow-xl p-2 font-medium">
                  <p>
                    Calculada como Receita Bruta + Deduções (as deduções já são valores negativos), representando o
                    valor efetivo após deduções.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-100 p-1.5 flex items-center justify-center">
              <TrendingUpIcon className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(netRevenue)}</div>
            <p className="text-xs text-slate-500 mt-1">Receita bruta menos deduções</p>
          </CardContent>
        </Card>

        {/* Despesas */}
        <Card className="overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-red-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-1.5">
              Despesas
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-red-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-white text-gray-950 shadow-xl p-2 font-medium">
                  <p>
                    Soma do valor absoluto de todos os valores do grupo DESPESA, incluindo despesas operacionais,
                    financeiras e administrativas.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-100 p-1.5 flex items-center justify-center">
              <TrendingDownIcon className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(expenses)}</div>
            <p className="text-xs text-slate-500 mt-1">Total de gastos operacionais</p>
          </CardContent>
        </Card>

        {/* Resultado Líquido */}
        <Card
          className={`overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white ${netResult >= 0 ? "to-emerald-50" : "to-red-50"}`}
        >
          <div className={`absolute top-0 left-0 w-full h-1 ${netResult >= 0 ? "bg-emerald-500" : "bg-red-500"}`}></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={`text-sm font-medium ${netResult >= 0 ? "text-emerald-700" : "text-red-700"} flex items-center gap-1.5`}
            >
              Resultado Líquido
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className={`h-4 w-4 ${netResult >= 0 ? "text-emerald-400" : "text-red-400"} cursor-help`} />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-white text-gray-950 shadow-xl p-2 font-medium">
                  <p>
                    Calculado como Receita Líquida - Despesas, representando o lucro ou prejuízo final após todas as
                    receitas e despesas.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <div
              className={`h-8 w-8 rounded-full ${netResult >= 0 ? "bg-emerald-100" : "bg-red-100"} p-1.5 flex items-center justify-center`}
            >
              {netResult >= 0 ? (
                <ArrowUpIcon className="h-5 w-5 text-emerald-600" />
              ) : (
                <ArrowDownIcon className="h-5 w-5 text-red-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(netResult)}</div>
            <p className="text-xs text-slate-500 mt-1">Receita líquida menos despesas</p>
          </CardContent>
        </Card>

        {/* Margem Líquida */}
        <Card
          className={`overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white ${netMargin >= 0 ? "to-purple-50" : "to-red-50"}`}
        >
          <div className={`absolute top-0 left-0 w-full h-1 ${netMargin >= 0 ? "bg-purple-500" : "bg-red-500"}`}></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={`text-sm font-medium ${netMargin >= 0 ? "text-purple-700" : "text-red-700"} flex items-center gap-1.5`}
            >
              Margem Líquida
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className={`h-4 w-4 ${netMargin >= 0 ? "text-purple-400" : "text-red-400"} cursor-help`} />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-white text-gray-950 shadow-xl p-2 font-medium">
                  <p>
                    Calculada como (Resultado Líquido / Receita Líquida) × 100, representando a porcentagem de lucro em
                    relação à receita.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <div
              className={`h-8 w-8 rounded-full ${netMargin >= 0 ? "bg-purple-100" : "bg-red-100"} p-1.5 flex items-center justify-center`}
            >
              {netMargin >= 0 ? (
                <ArrowUpIcon className="h-5 w-5 text-purple-600" />
              ) : (
                <ArrowDownIcon className="h-5 w-5 text-red-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-slate-800">{netMargin.toFixed(2)}%</div>
            <p className="text-xs text-slate-500 mt-1">Percentual do resultado sobre a receita</p>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

