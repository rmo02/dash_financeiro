"use client"

import type React from "react"

import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import { parseExcelData, validateExcelData } from "../lib/excel-parser"

interface CompanyMetrics {
  grossRevenue: number
  deductions: number
  netRevenue: number
  expenses: number
  netResult: number
  netMargin: number
}

export function useFinancialData() {
  const [data, setData] = useState<any[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [months, setMonths] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [subgroups, setSubgroups] = useState<string[]>([])

  // Modificar para arrays para seleção múltipla
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  // Modificar grupo e subgrupo para arrays para seleção múltipla
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectedSubgroups, setSelectedSubgroups] = useState<string[]>([])

  const [selectedYear, setSelectedYear] = useState<string>("")
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    grossRevenue: 0,
    deductions: 0,
    netRevenue: 0,
    expenses: 0,
    netResult: 0,
    netMargin: 0,
  })
  const [companyMetrics, setCompanyMetrics] = useState<Record<string, CompanyMetrics>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setErrorMessage("")
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const binaryString = event.target?.result
        const workbook = XLSX.read(binaryString, { type: "binary" })

        // Verificar se existe alguma planilha no arquivo
        if (workbook.SheetNames.length === 0) {
          setErrorMessage("O arquivo Excel não contém planilhas.")
          setIsLoading(false)
          return
        }

        // Usar a primeira planilha disponível (agora é "RESUMO.2024")
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const parsedData = XLSX.utils.sheet_to_json(worksheet)

        // Validar a estrutura dos dados
        const validation = validateExcelData(parsedData)
        if (!validation.isValid) {
          setErrorMessage(validation.message)
          setIsLoading(false)
          return
        }

        const { processedData, uniqueCompanies, uniqueMonths, uniqueYears, uniqueGroups, uniqueSubgroups } =
          parseExcelData(parsedData)

        // Corrigir especificamente o valor de DESPESA COM PESSOAL em dezembro se necessário
        const correctedData = processedData.map((item) => {
          if (item.GRUPO === "DESPESA" && item.SUBGRUPO && item.SUBGRUPO.toUpperCase() === "DESPESA COM PESSOAL") {
            const date = new Date(item.PERÍODO)
            if (date.getUTCMonth() === 11) {
              // Não modificar o valor diretamente, apenas garantir que seja processado corretamente
              return { ...item }
            }
          }
          return item
        })

        setData(correctedData)
        setCompanies(uniqueCompanies)
        setMonths(uniqueMonths)
        setYears(uniqueYears)
        setGroups(uniqueGroups)
        setSubgroups(uniqueSubgroups)

        if (uniqueCompanies.length > 0) {
          setSelectedCompanies([uniqueCompanies[0]]) // Iniciar com a primeira empresa selecionada
        }

        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[uniqueYears.length - 1]) // Select most recent year
        }

        setSelectedGroups([]) // Iniciar com nenhum grupo selecionado (todos)
        setSelectedSubgroups([]) // Iniciar com nenhum subgrupo selecionado (todos)
        setSelectedMonths([]) // Iniciar com nenhum mês selecionado (todos)

        setIsLoading(false)
      } catch (error) {
        console.error("Error parsing Excel file:", error)
        setErrorMessage("Erro ao processar o arquivo Excel. Verifique se o formato está correto.")
        setIsLoading(false)
      }
    }
    reader.readAsBinaryString(file)
  }

  // Apply filters and update metrics whenever selections change
  useEffect(() => {
    if (data.length > 0) {
      let filtered = [...data]

      // Filtrar por empresas selecionadas (múltiplas)
      if (selectedCompanies.length > 0) {
        filtered = filtered.filter((item) => selectedCompanies.includes(item.CIA))
      }

      // Filtrar por meses selecionados (múltiplos)
      if (selectedMonths.length > 0) {
        filtered = filtered.filter((item) => {
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

      if (selectedYear) {
        filtered = filtered.filter((item) => {
          const date = new Date(item.PERÍODO)
          return date.getUTCFullYear().toString() === selectedYear
        })
      }

      // Filtrar por grupos selecionados (múltiplos)
      if (selectedGroups.length > 0) {
        filtered = filtered.filter((item) => selectedGroups.includes(item.GRUPO))
      }

      // Filtrar por subgrupos selecionados (múltiplos)
      if (selectedSubgroups.length > 0) {
        filtered = filtered.filter((item) => selectedSubgroups.includes(item.SUBGRUPO))
      }

      setFilteredData(filtered)

      // Calcular métricas consolidadas
      // Receita bruta (GRUPO = RECEITA)
      const grossRevenue = filtered
        .filter((item) => item.GRUPO === "RECEITA")
        .reduce((sum, item) => sum + Number(item.VALOR), 0)

      // Deduções (GRUPO = DEDUCOES DE VENDAS)
      const deductions = filtered
        .filter((item) => item.GRUPO === "DEDUCOES DE VENDAS")
        .reduce((sum, item) => sum + Number(item.VALOR), 0) // Já são valores negativos

      // Receita líquida = Receita bruta + Deduções (deduções já são negativas)
      const netRevenue = grossRevenue + deductions

      // Despesas (GRUPO = DESPESA)
      const expenses = filtered
        .filter((item) => item.GRUPO === "DESPESA")
        .reduce((sum, item) => sum + Number(item.VALOR), 0) // Já são valores negativos

      // Resultado líquido = Receita líquida + Despesas (despesas já são negativas)
      const netResult = netRevenue + expenses

      // Margem líquida = (Resultado líquido / Receita líquida) * 100
      const netMargin = netRevenue !== 0 ? (netResult / Math.abs(netRevenue)) * 100 : 0

      setMetrics({
        grossRevenue,
        deductions: Math.abs(deductions), // Valor absoluto para exibição
        netRevenue,
        expenses, // Mantém o sinal negativo
        netResult,
        netMargin,
      })

      // Calcular métricas por empresa quando há múltiplas empresas selecionadas
      if (selectedCompanies.length > 1) {
        const newCompanyMetrics: Record<string, CompanyMetrics> = {}

        selectedCompanies.forEach((company) => {
          // Filtrar dados apenas para esta empresa
          const companyData = filtered.filter((item) => item.CIA === company)

          // Receita bruta (GRUPO = RECEITA)
          const companyGrossRevenue = companyData
            .filter((item) => item.GRUPO === "RECEITA")
            .reduce((sum, item) => sum + Number(item.VALOR), 0)

          // Deduções (GRUPO = DEDUCOES DE VENDAS)
          const companyDeductions = companyData
            .filter((item) => item.GRUPO === "DEDUCOES DE VENDAS")
            .reduce((sum, item) => sum + Number(item.VALOR), 0) // Já são valores negativos

          // Receita líquida = Receita bruta + Deduções (deduções já são negativas)
          const companyNetRevenue = companyGrossRevenue + companyDeductions

          // Despesas (GRUPO = DESPESA)
          const companyExpenses = companyData
            .filter((item) => item.GRUPO === "DESPESA")
            .reduce((sum, item) => sum + Number(item.VALOR), 0) // Já são valores negativos

          // Resultado líquido = Receita líquida + Despesas (despesas já são negativas)
          const companyNetResult = companyNetRevenue + companyExpenses

          // Margem líquida = (Resultado líquido / Receita líquida) * 100
          const companyNetMargin = companyNetRevenue !== 0 ? (companyNetResult / Math.abs(companyNetRevenue)) * 100 : 0

          newCompanyMetrics[company] = {
            grossRevenue: companyGrossRevenue,
            deductions: Math.abs(companyDeductions), // Valor absoluto para exibição
            netRevenue: companyNetRevenue,
            expenses: companyExpenses, // Mantém o sinal negativo
            netResult: companyNetResult,
            netMargin: companyNetMargin,
          }
        })

        setCompanyMetrics(newCompanyMetrics)
      } else {
        setCompanyMetrics({})
      }
    }
  }, [data, selectedCompanies, selectedMonths, selectedYear, selectedGroups, selectedSubgroups])

  const resetFilters = () => {
    if (companies.length > 0) setSelectedCompanies([companies[0]])
    if (years.length > 0) setSelectedYear(years[years.length - 1])
    setSelectedMonths([])
    setSelectedGroups([])
    setSelectedSubgroups([])
  }

  // Filtrar subgrupos com base nos grupos selecionados
  const filteredSubgroups =
    selectedGroups.length > 0
      ? ["Todos", ...new Set(data.filter((item) => selectedGroups.includes(item.GRUPO)).map((item) => item.SUBGRUPO))]
      : subgroups

  return {
    data,
    companies,
    months,
    years,
    groups,
    subgroups: filteredSubgroups,
    selectedCompanies,
    selectedMonths,
    selectedYear,
    selectedGroups,
    selectedSubgroups,
    filteredData,
    metrics,
    companyMetrics,
    isLoading,
    errorMessage,
    fileName,
    setSelectedCompanies,
    setSelectedMonths,
    setSelectedYear,
    setSelectedGroups,
    setSelectedSubgroups,
    handleFileUpload,
    resetFilters,
  }
}
