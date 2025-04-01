import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { RevenueChart } from "./revenue-chart"
import { DeductionsChart } from "./deductions-chart"
import { ExpensesChart } from "./expenses-chart"
import { ResultChart } from "./result-chart"
import { GroupChart } from "./group-chart"
import { SubgroupChart } from "./subgroup-chart"
import { AccountChart } from "./account-chart"
import {
  InfoIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BarChart3Icon,
  PieChartIcon,
  ListTreeIcon,
  LayoutListIcon,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface DashboardTabsProps {
  data: any[]
  selectedCompanies: string[]
  selectedYear: string
  selectedMonths: string[]
  selectedGroup: string
  selectedSubgroup: string
}

export function DashboardTabs({
  data,
  selectedCompanies,
  selectedYear,
  selectedMonths,
  selectedGroup,
  selectedSubgroup,
}: DashboardTabsProps) {
  // Função para formatar a lista de empresas selecionadas
  const formatCompanies = () => {
    if (selectedCompanies.length === 0) return "todas as empresas"
    if (selectedCompanies.length === 1) return selectedCompanies[0]
    return `${selectedCompanies.length} empresas selecionadas`
  }

  // Função para formatar a lista de meses selecionados
  const formatMonths = () => {
    if (selectedMonths.length === 0) return "todos os meses"
    if (selectedMonths.length === 1) {
      const month = selectedMonths[0]
      return month.charAt(0).toUpperCase() + month.slice(1)
    }
    return `${selectedMonths.length} meses selecionados`
  }

  return (
    <TooltipProvider>
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-slate-100 p-1 rounded-lg shadow-md">
          <TabsTrigger
            value="revenue"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-md flex items-center gap-1.5 transition-all"
          >
            <TrendingUpIcon size={16} />
            <span className="hidden sm:inline">Receita Bruta</span>
            <span className="sm:hidden">Receita</span>
          </TabsTrigger>
          <TabsTrigger
            value="deductions"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-md rounded-md flex items-center gap-1.5 transition-all"
          >
            <TrendingDownIcon size={16} />
            <span className="hidden sm:inline">Deduções</span>
            <span className="sm:hidden">Deduções</span>
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md rounded-md flex items-center gap-1.5 transition-all"
          >
            <TrendingDownIcon size={16} />
            <span className="hidden sm:inline">Despesas</span>
            <span className="sm:hidden">Despesas</span>
          </TabsTrigger>
          <TabsTrigger
            value="result"
            className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md rounded-md flex items-center gap-1.5 transition-all"
          >
            <BarChart3Icon size={16} />
            <span className="hidden sm:inline">Resultado</span>
            <span className="sm:hidden">Resultado</span>
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md rounded-md flex items-center gap-1.5 transition-all"
          >
            <PieChartIcon size={16} />
            <span className="hidden sm:inline">Grupos</span>
            <span className="sm:hidden">Grupos</span>
          </TabsTrigger>
          <TabsTrigger
            value="subgroups"
            className="data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-md rounded-md flex items-center gap-1.5 transition-all"
          >
            <ListTreeIcon size={16} />
            <span className="hidden sm:inline">Subgrupos</span>
            <span className="sm:hidden">Subgrupos</span>
          </TabsTrigger>
          <TabsTrigger
            value="accounts"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-md rounded-md flex items-center gap-1.5 transition-all"
          >
            <LayoutListIcon size={16} />
            <span className="hidden sm:inline">Contas</span>
            <span className="sm:hidden">Contas</span>
          </TabsTrigger>
        </TabsList>

        {/* Receita Bruta */}
        <TabsContent value="revenue" className="mt-6">
          <Card className="overflow-hidden rounded-lg border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 p-2 flex items-center justify-center">
                    <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-blue-700">Receita Bruta Mensal</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-blue-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[#DBEAFE] shadow-md">
                          <p>
                            Exibe a receita bruta mensal, calculada a partir da soma de todos os valores do grupo
                            RECEITA para cada mês.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardDescription>
                      Receita bruta por mês para {formatCompanies()} em {selectedYear || "todos os anos"} (
                      {formatMonths()})
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RevenueChart
                data={data}
                selectedCompanies={selectedCompanies}
                selectedYear={selectedYear}
                selectedMonths={selectedMonths}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deduções */}
        <TabsContent value="deductions" className="mt-6">
          <Card className="overflow-hidden rounded-lg border-0 shadow-lg bg-gradient-to-br from-white to-amber-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-100 p-2 flex items-center justify-center">
                    <TrendingDownIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-amber-700">Deduções Mensais</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-amber-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[#FEF3C6] shadow-md">
                          <p>
                            Exibe as deduções mensais, calculadas a partir da soma do valor absoluto de todos os valores
                            do grupo DEDUCOES DE VENDAS para cada mês.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardDescription>
                      Deduções por mês para {formatCompanies()} em {selectedYear || "todos os anos"} ({formatMonths()})
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <DeductionsChart
                data={data}
                selectedCompanies={selectedCompanies}
                selectedYear={selectedYear}
                selectedMonths={selectedMonths}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Despesas */}
        <TabsContent value="expenses" className="mt-6">
          <Card className="overflow-hidden rounded-lg border-0 shadow-lg bg-gradient-to-br from-white to-red-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-red-100 p-2 flex items-center justify-center">
                    <TrendingDownIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-red-700">Despesas Mensais</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-red-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[#FFE2E2] shadow-md">
                          <p>
                            Exibe as despesas mensais, calculadas a partir da soma do valor absoluto de todos os valores
                            do grupo DESPESA para cada mês.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardDescription>
                      Despesas por mês para {formatCompanies()} em {selectedYear || "todos os anos"} ({formatMonths()})
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ExpensesChart
                data={data}
                selectedCompanies={selectedCompanies}
                selectedYear={selectedYear}
                selectedMonths={selectedMonths}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resultado */}
        <TabsContent value="result" className="mt-6">
          <Card className="overflow-hidden rounded-lg border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-100 p-2 flex items-center justify-center">
                    <BarChart3Icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-emerald-700">Resultado Líquido Mensal</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-emerald-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[#D0FAE5] shadow-md">
                          <p>
                            Exibe o resultado líquido mensal, calculado como Receita + Deduções + Despesas para cada
                            mês. Valores positivos representam lucro e negativos representam prejuízo.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardDescription>
                      Resultado líquido por mês para {formatCompanies()} em {selectedYear || "todos os anos"} (
                      {formatMonths()})
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ResultChart
                data={data}
                selectedCompanies={selectedCompanies}
                selectedYear={selectedYear}
                selectedMonths={selectedMonths}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grupos */}
        <TabsContent value="groups" className="mt-6">
          <Card className="overflow-hidden rounded-lg border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-purple-100 p-2 flex items-center justify-center">
                    <PieChartIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-purple-700">Distribuição por Grupos</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-purple-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[#F3E8FF] shadow-md">
                          <p>
                            Exibe a distribuição percentual dos valores por grupo (RECEITA, DEDUCOES DE VENDAS,
                            DESPESA), usando o valor absoluto para facilitar a comparação.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardDescription>
                      Distribuição de valores por grupo para {formatCompanies()} em {selectedYear || "todos os anos"} (
                      {formatMonths()})
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <GroupChart
                data={data}
                selectedCompanies={selectedCompanies}
                selectedYear={selectedYear}
                selectedMonths={selectedMonths}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subgrupos */}
        <TabsContent value="subgroups" className="mt-6">
          <Card className="overflow-hidden rounded-lg border-0 shadow-lg bg-gradient-to-br from-white to-violet-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-violet-500"></div>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-violet-100 p-2 flex items-center justify-center">
                    <ListTreeIcon className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-violet-700">Distribuição por Subgrupos</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-violet-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[#F3E8FF] shadow-md">
                          <p>
                            Exibe a distribuição percentual dos valores por subgrupo, usando o valor absoluto para
                            facilitar a comparação. Filtrável por grupo específico.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardDescription>
                      Distribuição de valores por subgrupo{" "}
                      {selectedGroup !== "Todos" ? `para o grupo ${selectedGroup}` : ""}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <SubgroupChart
                data={data}
                selectedCompanies={selectedCompanies}
                selectedYear={selectedYear}
                selectedGroup={selectedGroup}
                selectedMonths={selectedMonths}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contas */}
        <TabsContent value="accounts" className="mt-6">
          <Card className="overflow-hidden rounded-lg border-0 shadow-lg bg-gradient-to-br from-white to-amber-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-100 p-2 flex items-center justify-center">
                    <LayoutListIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-amber-700">Top 10 Contas</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-amber-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[#FEF3C6] shadow-md">
                          <p>
                            Exibe as 10 principais contas por valor absoluto, mostrando o código e nome da conta. As
                            cores indicam se o valor é positivo (receita) ou negativo (despesa/dedução).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardDescription>
                      As 10 principais contas por valor{" "}
                      {selectedGroup !== "Todos" ? `para o grupo ${selectedGroup}` : ""}
                      {selectedSubgroup !== "Todos" ? ` e subgrupo ${selectedSubgroup}` : ""}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <AccountChart
                data={data}
                selectedCompanies={selectedCompanies}
                selectedYear={selectedYear}
                selectedMonths={selectedMonths}
                selectedGroup={selectedGroup}
                selectedSubgroup={selectedSubgroup}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  )
}

