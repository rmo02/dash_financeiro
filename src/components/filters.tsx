"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Filter, RefreshCw, Building, Calendar, CalendarDays, FolderKanban, FolderTree } from "lucide-react"
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
  selectedGroup: string
  selectedSubgroup: string
  setSelectedCompanies: (companies: string[]) => void
  setSelectedMonths: (months: string[]) => void
  setSelectedYear: (year: string) => void
  setSelectedGroup: (group: string) => void
  setSelectedSubgroup: (subgroup: string) => void
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
  selectedGroup,
  selectedSubgroup,
  setSelectedCompanies,
  setSelectedMonths,
  setSelectedYear,
  setSelectedGroup,
  setSelectedSubgroup,
  resetFilters,
}: FiltersProps) {
  // Converter arrays de strings para arrays de opções para o MultiSelect
  const companyOptions: Option[] = companies.map((company) => ({
    label: company,
    value: company,
  }))

  const monthOptions: Option[] = months.map((month) => ({
    label: month.charAt(0).toUpperCase() + month.slice(1),
    value: month.toLowerCase(),
  }))

  return (
    <TooltipProvider>
      <Card className="overflow-hidden rounded-lg border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-purple-100 p-2 flex items-center justify-center">
                <Filter size={18} className="text-purple-600" />
              </div>
              <CardTitle className="text-purple-700">Filtros</CardTitle>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs flex items-center gap-1.5 border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <RefreshCw size={14} />
                  Resetar Filtros
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Restaurar todos os filtros para os valores padrão</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
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
                <SelectContent className="bg-white">
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
                <label className="text-sm font-medium text-slate-700">Grupo</label>
              </div>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-full bg-white border-slate-200 hover:border-purple-300 transition-colors focus:ring-purple-200">
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FolderTree size={15} className="text-purple-500" />
                <label className="text-sm font-medium text-slate-700">Subgrupo</label>
              </div>
              <Select value={selectedSubgroup} onValueChange={setSelectedSubgroup}>
                <SelectTrigger className="w-full bg-white border-slate-200 hover:border-purple-300 transition-colors focus:ring-purple-200">
                  <SelectValue placeholder="Selecione o subgrupo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {subgroups.map((subgroup) => (
                    <SelectItem key={subgroup} value={subgroup}>
                      {subgroup}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

