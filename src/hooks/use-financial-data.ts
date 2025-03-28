"use client"

import type React from "react"

import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import { parseExcelData, validateExcelData } from "../lib/excel-parser"

export function useFinancialData() {
  const [data, setData] = useState<any[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [months, setMonths] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [subgroups, setSubgroups] = useState<string[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<string>("Todos")
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>("Todos")
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    grossRevenue: 0,
    deductions: 0,
    netRevenue: 0,
    expenses: 0,
    netResult: 0,
    netMargin: 0,
  })
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

        // Check if the "VENDAS DO PERIODO" sheet exists
        if (!workbook.SheetNames.includes("VENDAS DO PERIODO")) {
          setErrorMessage("A planilha 'VENDAS DO PERIODO' não foi encontrada no arquivo Excel.")
          setIsLoading(false)
          return
        }

        const worksheet = workbook.Sheets["VENDAS DO PERIODO"]
        const parsedData = XLSX.utils.sheet_to_json(worksheet)

        // Validate the data structure
        const validation = validateExcelData(parsedData)
        if (!validation.isValid) {
          setErrorMessage(validation.message)
          setIsLoading(false)
          return
        }

        const { processedData, uniqueCompanies, uniqueMonths, uniqueYears, uniqueGroups, uniqueSubgroups } =
          parseExcelData(parsedData)

        setData(processedData)
        setCompanies(uniqueCompanies)
        setMonths(uniqueMonths)
        setYears(uniqueYears)
        setGroups(uniqueGroups)
        setSubgroups(uniqueSubgroups)

        if (uniqueCompanies.length > 0) {
          setSelectedCompany(uniqueCompanies[0])
        }

        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[uniqueYears.length - 1]) // Select most recent year
        }

        setSelectedGroup("Todos") // Default to "Todos"
        setSelectedSubgroup("Todos") // Default to "Todos"
        setSelectedMonth("all") // Default to "Todos os meses"

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

      if (selectedCompany) {
        filtered = filtered.filter((item) => item.CIA === selectedCompany)
      }

      if (selectedMonth && selectedMonth !== "all") {
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
          const itemMonth = monthNames[monthIndex]
          return itemMonth === selectedMonth.toLowerCase()
        })
      }

      if (selectedYear) {
        filtered = filtered.filter((item) => {
          const date = new Date(item.PERÍODO)
          return date.getUTCFullYear().toString() === selectedYear
        })
      }

      if (selectedGroup && selectedGroup !== "Todos") {
        filtered = filtered.filter((item) => item.GRUPO === selectedGroup)
      }

      if (selectedSubgroup && selectedSubgroup !== "Todos") {
        filtered = filtered.filter((item) => item.SUBGRUPO === selectedSubgroup)
      }

      setFilteredData(filtered)

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
        .reduce((sum, item) => sum + Math.abs(Number(item.VALOR)), 0) // Usar valor absoluto

      // Resultado líquido = Receita líquida - Despesas
      const netResult = netRevenue - expenses

      // Margem líquida = (Resultado líquido / Receita líquida) * 100
      const netMargin = netRevenue > 0 ? (netResult / netRevenue) * 100 : 0

      setMetrics({
        grossRevenue,
        deductions: Math.abs(deductions), // Valor absoluto para exibição
        netRevenue,
        expenses,
        netResult,
        netMargin,
      })
    }
  }, [data, selectedCompany, selectedMonth, selectedYear, selectedGroup, selectedSubgroup])

  const resetFilters = () => {
    if (companies.length > 0) setSelectedCompany(companies[0])
    if (years.length > 0) setSelectedYear(years[years.length - 1])
    setSelectedMonth("all")
    setSelectedGroup("Todos")
    setSelectedSubgroup("Todos")
  }

  // Filtrar subgrupos com base no grupo selecionado
  const filteredSubgroups =
    selectedGroup !== "Todos"
      ? [
          "Todos",
          ...subgroups.filter((sg) => data.some((item) => item.GRUPO === selectedGroup && item.SUBGRUPO === sg)),
        ]
      : subgroups

  return {
    data,
    companies,
    months,
    years,
    groups,
    subgroups: filteredSubgroups,
    selectedCompany,
    selectedMonth,
    selectedYear,
    selectedGroup,
    selectedSubgroup,
    filteredData,
    metrics,
    isLoading,
    errorMessage,
    fileName,
    setSelectedCompany,
    setSelectedMonth,
    setSelectedYear,
    setSelectedGroup,
    setSelectedSubgroup,
    handleFileUpload,
    resetFilters,
  }
}

