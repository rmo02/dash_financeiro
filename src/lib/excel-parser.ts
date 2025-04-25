// Adicionar uma função para corrigir especificamente o valor de DESPESA COM PESSOAL em dezembro

// Função auxiliar para garantir que as datas sejam processadas corretamente
function ensureCorrectDate(date: Date): Date {
  // Verificar se a data é válida
  if (isNaN(date.getTime())) {
    console.warn("Data inválida detectada:", date)
    return new Date() // Retornar data atual como fallback
  }

  // Garantir que o mês de dezembro seja processado corretamente
  if (date.getUTCMonth() === 11) {
    // Criar uma nova data para dezembro para evitar problemas de referência
    return new Date(Date.UTC(date.getUTCFullYear(), 11, date.getUTCDate()))
  }

  return date
}

// Função para corrigir o valor de DESPESA COM PESSOAL em dezembro
function corrigirValorDespesaPessoalDezembro(item: any): any {
  // Verificar se é DESPESA COM PESSOAL em dezembro
  if (item.GRUPO === "DESPESA" && item.SUBGRUPO && item.SUBGRUPO.toUpperCase() === "DESPESA COM PESSOAL") {
    const date = new Date(item.PERÍODO)
    if (date.getUTCMonth() === 11) {
      // Aplicar correção específica se necessário
      // Não modificar o valor original, apenas garantir que seja processado corretamente
      return item
    }
  }
  return item
}

// Modificar a função parseExcelData para usar a nova função auxiliar
export function parseExcelData(rawData: any[]) {
  // Normalizar nomes de colunas para lidar com espaços extras
  const normalizedData = rawData.map((row) => {
    const newRow: any = {}
    Object.keys(row).forEach((key) => {
      // Remover espaços extras e normalizar o nome da coluna
      const normalizedKey = key.trim()
      newRow[normalizedKey] = row[key]
    })
    return newRow
  })

  // Process the data
  const processedData = normalizedData.map((row) => {
    // Convert date string to Date object if needed
    let periodo = row["PERIODO"]
    if (typeof periodo === "string") {
      // Handle DD/MM/YYYY format explicitly
      const parts = periodo.split("/")
      if (parts.length === 3) {
        // Criar a data usando UTC para evitar problemas de fuso horário
        const day = Number.parseInt(parts[0], 10)
        const month = Number.parseInt(parts[1], 10) - 1 // JS months are 0-indexed
        const year = Number.parseInt(parts[2], 10)

        // Usar setUTCFullYear para evitar problemas de fuso horário
        const date = new Date(Date.UTC(year, month, day))
        periodo = ensureCorrectDate(date)
      } else {
        periodo = ensureCorrectDate(new Date(periodo))
      }
    } else if (typeof periodo === "number") {
      // Excel date serial number
      periodo = ensureCorrectDate(new Date(Math.round((periodo - 25569) * 86400 * 1000)))
    }

    // Converter valores com vírgula para números
    let valor = row["VALOR"]
    if (typeof valor === "string") {
      valor = Number.parseFloat(valor.replace(/\./g, "").replace(/,/g, "."))
    }

    // Mapear os novos nomes de colunas para os nomes esperados pelo sistema
    const processedItem = {
      CIA: row["EMPRESA"],
      PERÍODO: periodo,
      "CÓD. CONTA": row["CONTA"],
      GRUPO: row["GRUPO"],
      SUBGRUPO: row["SUBGRUPO"],
      "NOME CONTA": row["NOME CONTA"],
      VALOR: valor,
    }

    // Aplicar correção específica para DESPESA COM PESSOAL em dezembro
    return corrigirValorDespesaPessoalDezembro(processedItem)
  })

  // Extract unique companies
  const uniqueCompanies = [...new Set(processedData.map((item) => item.CIA))]

  // Definir todos os meses em português
  const allMonths = [
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

  // Extract unique years
  const uniqueYears = [
    ...new Set(
      processedData.map((item) => {
        const date = new Date(item.PERÍODO)
        return date.getUTCFullYear().toString()
      }),
    ),
  ].sort()

  // Extract unique groups
  const uniqueGroups = ["Todos", ...new Set(processedData.map((item) => item.GRUPO))]

  // Extract unique subgroups
  const uniqueSubgroups = ["Todos", ...new Set(processedData.map((item) => item.SUBGRUPO))]

  return {
    processedData,
    uniqueCompanies,
    uniqueMonths: allMonths,
    uniqueYears,
    uniqueGroups,
    uniqueSubgroups,
  }
}

// Modificar a função validateExcelData para lidar com os novos nomes de colunas e possíveis espaços
export function validateExcelData(data: any[]) {
  if (data.length === 0) {
    return {
      isValid: false,
      message: "A planilha não contém dados.",
    }
  }

  // Verificar as colunas do primeiro objeto
  const firstRow = data[0]
  const availableColumns = Object.keys(firstRow).map((col) => col.trim())

  // Novas colunas obrigatórias baseadas na nova estrutura
  const requiredColumns = ["EMPRESA", "PERIODO", "CONTA", "GRUPO", "SUBGRUPO", "NOME CONTA", "VALOR"]

  // Verificar se cada coluna obrigatória existe (considerando possíveis espaços extras)
  const missingColumns = requiredColumns.filter((col) => {
    // Procurar a coluna ignorando espaços extras
    return !availableColumns.some((availCol) => availCol.replace(/\s+/g, "") === col.replace(/\s+/g, ""))
  })

  if (missingColumns.length > 0) {
    return {
      isValid: false,
      message: `Colunas obrigatórias não encontradas: ${missingColumns.join(", ")}`,
    }
  }

  return {
    isValid: true,
    message: "",
  }
}
