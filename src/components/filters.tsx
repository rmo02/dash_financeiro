"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  Filter,
  RefreshCw,
  Building,
  Calendar,
  CalendarDays,
  FolderKanban,
  FolderTree,
  ChevronDown,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { MultiSelect, type Option } from "./ui/multi-select"

interface FiltersProps {
  companies: string[]
  months: string[]
  years: string[]
  groups: string[]
  subgroups: string[]
  selectedCompanies: string[]
  selectedMonths: string[]
  selectedYear: string
  selectedGroups: string[]
  selectedSubgroups: string[]
  setSelectedCompanies: (companies: string[]) => void
  setSelectedMonths: (months: string[]) => void
  setSelectedYear: (year: string) => void
  setSelectedGroups: (groups: string[]) => void
  setSelectedSubgroups: (subgroups: string[]) => void
  resetFilters: () => void
}

export function Filters({
  companies,
  months,
  years,
  groups,
  subgroups,
  selectedCompanies,
  selectedMonths,
  selectedYear,
  selectedGroups,
  selectedSubgroups,
  setSelectedCompanies,
  setSelectedMonths,
  setSelectedYear,
  setSelectedGroups,
  setSelectedSubgroups,
  resetFilters,
}: FiltersProps) {
  // Adicionar estado para controlar a expansão dos filtros
  const [isExpanded, setIsExpanded] = useState(true)

  // Função para alternar o estado de expansão
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  // Converter arrays de strings para arrays de opções para o MultiSelect
  const companyOptions: Option[] = companies.map((company) => ({
    label: company,
    value: company,
  }))

  const monthOptions: Option[] = months.map((month) => ({
    label: month.charAt(0).toUpperCase() + month.slice(1),
    value: month.toLowerCase(),
  }))

  const groupOptions: Option[] = groups
    .filter((group) => group !== "Todos")
    .map((group) => ({
      label: group,
      value: group,
    }))

  const subgroupOptions: Option[] = subgroups
    .filter((subgroup) => subgroup !== "Todos")
    .map((subgroup) => ({
      label: subgroup,
      value: subgroup,
    }))

  return (
    <TooltipProvider>
      <Card className="overflow-hidden rounded-lg border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
        <CardHeader className="border-b cursor-pointer" onClick={toggleExpansion}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-purple-100 p-2 flex items-center justify-center">
                <Filter size={18} className="text-purple-600" />
              </div>
              <CardTitle className="text-purple-700">Filtros</CardTitle>
              <ChevronDown
                size={18}
                className={`text-purple-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
              />
            </div>
            {isExpanded && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation() // Evitar que o clique se propague para o CardHeader
                      resetFilters()
                    }}
                    className="text-xs flex items-center gap-1.5 border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Resetar Filtros
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white shadow-lg border border-gray-100 p-3 rounded-lg text-gray-700">
                  <p>Restaurar todos os filtros para os valores padrão</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>

        {/* Conteúdo dos filtros - exibido apenas quando expandido */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Building size={15} className="text-purple-500" />
                  <label className="text-sm font-medium text-slate-700">Empresas</label>
                </div>
                <MultiSelect
                  options={companyOptions}
                  selected={selectedCompanies}
                  onChange={setSelectedCompanies}
                  placeholder="Selecione as empresas"
                  className="bg-white border-slate-200 hover:border-purple-300 transition-colors focus:ring-purple-200"
                  badgeClassName="bg-purple-100 text-purple-700"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Calendar size={15} className="text-purple-500" />
                  <label className="text-sm font-medium text-slate-700">Ano</label>
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full bg-white border-slate-200 hover:border-purple-300 transition-colors focus:ring-purple-200">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <CalendarDays size={15} className="text-purple-500" />
                  <label className="text-sm font-medium text-slate-700">Meses</label>
                </div>
                <MultiSelect
                  options={monthOptions}
                  selected={selectedMonths}
                  onChange={setSelectedMonths}
                  placeholder="Selecione os meses"
                  className="bg-white border-slate-200 hover:border-purple-300 transition-colors focus:ring-purple-200"
                  badgeClassName="bg-purple-100 text-purple-700"
                  emptyMessage="Nenhum mês encontrado"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <FolderKanban size={15} className="text-purple-500" />
                  <label className="text-sm font-medium text-slate-700">Grupos</label>
                </div>
                <MultiSelect
                  options={groupOptions}
                  selected={selectedGroups}
                  onChange={setSelectedGroups}
                  placeholder="Selecione os grupos"
                  className="bg-white border-slate-200 hover:border-purple-300 transition-colors focus:ring-purple-200"
                  badgeClassName="bg-purple-100 text-purple-700"
                  emptyMessage="Nenhum grupo encontrado"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <FolderTree size={15} className="text-purple-500" />
                  <label className="text-sm font-medium text-slate-700">Subgrupos</label>
                </div>
                <MultiSelect
                  options={subgroupOptions}
                  selected={selectedSubgroups}
                  onChange={setSelectedSubgroups}
                  placeholder="Selecione os subgrupos"
                  className="bg-white border-slate-200 hover:border-purple-300 transition-colors focus:ring-purple-200"
                  badgeClassName="bg-purple-100 text-purple-700"
                  emptyMessage="Nenhum subgrupo encontrado"
                />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </TooltipProvider>
  )
}

