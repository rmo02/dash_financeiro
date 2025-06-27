"use client"
import { Button } from "./components/ui/button"
import { Upload, FileSpreadsheet } from "lucide-react"
import { FinancialMetrics } from "./components/financial-metrics"
import { Filters } from "./components/filters"
import { DashboardTabs } from "./components/dashboard-tabs"
import { useFinancialData } from "./hooks/use-financial-data"

function App() {
  const {
    data,
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
    metrics,
    isLoading,
    errorMessage,
    fileName,
    filteredData,
    setSelectedCompanies,
    setSelectedMonths,
    setSelectedYear,
    setSelectedGroups,
    setSelectedSubgroups,
    handleFileUpload,
    resetFilters,
    companyMetrics,
  } = useFinancialData()


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-4 sm:py-6 md:py-10 px-3 sm:px-4 max-w-[1600px]">
        <div className="flex flex-col space-y-4 sm:space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Dashboard Financeiro</h1>
              {fileName && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center">
                  <FileSpreadsheet size={16} className="mr-1" />
                  {fileName}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto mt-3 md:mt-0">
              <Button
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white w-full md:w-auto"
                disabled={isLoading}
              >
                <Upload size={16} />
                <label className="cursor-pointer">
                  Carregar Excel
                  <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                </label>
              </Button>
              {isLoading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-purple-600 font-medium">Processando...</span>
                </div>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              <p className="font-medium">Erro ao processar o arquivo</p>
              <p>{errorMessage}</p>
            </div>
          )}

          {data.length > 0 && (
            <>
              <Filters
                companies={companies}
                months={months}
                years={years}
                groups={groups}
                subgroups={subgroups}
                selectedCompanies={selectedCompanies}
                selectedMonths={selectedMonths}
                selectedYear={selectedYear}
                selectedGroups={selectedGroups}
                selectedSubgroups={selectedSubgroups}
                setSelectedCompanies={setSelectedCompanies}
                setSelectedMonths={setSelectedMonths}
                setSelectedYear={setSelectedYear}
                setSelectedGroups={setSelectedGroups}
                setSelectedSubgroups={setSelectedSubgroups}
                resetFilters={resetFilters}
              />

              <FinancialMetrics
                metrics={metrics}
                selectedCompanies={selectedCompanies}
                companyMetrics={companyMetrics}
                selectedGroups={selectedGroups}
                selectedSubgroups={selectedSubgroups}
                filteredData={filteredData}
              />

              <DashboardTabs
                data={data}
                selectedCompanies={selectedCompanies}
                selectedYear={selectedYear}
                selectedMonths={selectedMonths}
                selectedGroups={selectedGroups}
                selectedSubgroups={selectedSubgroups}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
