# Dashboard Financeiro

![Dashboard Financeiro](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dash_financeiro-mGRF2s3ADcy83qFWc8Qaq7pQcBnsHM.png)

Um dashboard financeiro moderno e interativo para análise de dados financeiros empresariais, desenvolvido com React, Next.js e Tailwind CSS.

## 🚀 Funcionalidades

- **Upload de Dados Excel**: Carregue facilmente seus dados financeiros a partir de arquivos Excel
- **Filtros Avançados**: Filtre os dados por empresa, ano, mês, grupo e subgrupo
- **Métricas Financeiras**: Visualize indicadores-chave como:
  - Receita Bruta
  - Deduções
  - Receita Líquida
  - Despesas
  - Resultado Líquido
  - Margem Líquida
- **Visualizações Gráficas**:
  - Gráficos de barras para análise mensal de receitas, deduções, despesas e resultados
  - Gráficos de pizza para distribuição por grupos e subgrupos
  - Gráficos de barras horizontais para análise das principais contas
- **Design Responsivo**: Interface adaptável para desktop e dispositivos móveis
- **Tooltips Informativos**: Explicações detalhadas sobre cada métrica e gráfico

## 📊 Análises Disponíveis

O dashboard oferece múltiplas visualizações para análise financeira completa:

1. **Receita Bruta Mensal**: Acompanhe a evolução da receita bruta ao longo dos meses
2. **Deduções Mensais**: Visualize impostos e outras deduções de vendas
3. **Despesas Mensais**: Analise os gastos operacionais por período
4. **Resultado Líquido**: Compare receitas e despesas para visualizar o resultado financeiro
5. **Distribuição por Grupos**: Entenda a proporção entre receitas, deduções e despesas
6. **Distribuição por Subgrupos**: Aprofunde a análise dentro de cada grupo financeiro
7. **Top 10 Contas**: Identifique as contas com maior impacto financeiro

## 🛠️ Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces
- **Next.js**: Framework React para aplicações web
- **Tailwind CSS**: Framework CSS para design rápido e responsivo
- **Recharts**: Biblioteca de gráficos para React
- **shadcn/ui**: Componentes UI reutilizáveis e acessíveis
- **XLSX**: Biblioteca para processamento de arquivos Excel

## 📋 Requisitos para Dados

O dashboard espera um arquivo Excel com a seguinte estrutura:

- **Planilha**: "VENDAS DO PERIODO"
- **Colunas obrigatórias**:
  - `CIA`: Nome da empresa/companhia
  - `PERÍODO`: Data no formato DD/MM/YYYY
  - `GRUPO`: Categoria principal (ex: RECEITA, DEDUCOES DE VENDAS, DESPESA)
  - `SUBGRUPO`: Subcategoria dentro do grupo
  - `NOME CONTA`: Nome da conta contábil
  - `CÓD. CONTA`: Código da conta (opcional)
  - `VALOR`: Valor monetário (pode conter valores negativos)

## 🚀 Como Usar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install