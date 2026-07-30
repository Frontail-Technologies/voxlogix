export interface CompanyInfo {
  name: string
  address: string
  phone: string
  logo?: string
}

export type FilterType = 'select' | 'multiselect' | 'radio' | 'daterange'

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  key: string
  label: string
  type: FilterType
  options?: FilterOption[]
  fetchOptions?: () => Promise<FilterOption[]>
  dependsOn?: string
  required?: boolean
  defaultValue?: string | string[]
}

export interface ColumnConfig {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  format?: 'currency' | 'date' | 'number' | 'text'
}

export type ReportRow = Record<string, string | number>

export interface ReportViewerProps {
  title: string
  filters: FilterConfig[]
  columns: ColumnConfig[]
  fetchData: (filters: Record<string, string | string[]>) => Promise<ReportRow[]>
  company: CompanyInfo
  totals?: string[]
  filename?: string
}
