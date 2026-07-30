'use client'

import React from 'react'
import { ColumnConfig, CompanyInfo, ReportRow } from './types'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ReportFrameProps {
  title: string
  columns: ColumnConfig[]
  rows: ReportRow[]
  totalRows?: ReportRow[]
  totals?: string[]
  company: CompanyInfo
  zoom: number
  activeFilterLabel?: string
}

function formatCell(value: string | number, format?: ColumnConfig['format']): React.ReactNode {
  if (value === undefined || value === null) return ''
  if (format === 'currency') {
    const num = Number(value)
    const formatted = Math.abs(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    if (num < 0) return <span className="font-medium text-red-500">-{formatted}</span>
    if (num > 0) return <span className="font-medium text-emerald-500">{formatted}</span>
    return formatted
  }
  if (format === 'number') return Number(value).toLocaleString()
  return String(value)
}

const alignClass: Record<NonNullable<ColumnConfig['align']>, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
}

export function ReportFrame({
  title,
  columns,
  rows,
  totalRows,
  totals = [],
  company,
  zoom,
  activeFilterLabel,
}: ReportFrameProps) {
  const year = new Date().getFullYear()
  const generatedAt = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
  const totalMap: Record<string, number> = {}

  totals.forEach((key) => {
    totalMap[key] = (totalRows ?? rows).reduce((sum, row) => sum + Number(row[key] ?? 0), 0)
  })

  return (
    <div
      className="origin-top-left transition-transform duration-200 print:!w-full print:!transform-none"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: `${100 / zoom}%` }}
    >
      <style media="print">{`
        @page { size: landscape; margin: 9mm; }

        #report-print-area,
        #report-print-area * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        #report-print-area [data-slot="table-header"],
        #report-print-area [data-slot="table-header"] th {
          background-color: #f3f4f6 !important;
          color: #374151 !important;
        }

        #report-print-area [data-slot="table-footer"],
        #report-print-area [data-slot="table-footer"] td {
          background-color: #f9fafb !important;
        }
      `}</style>

      <div
        id="report-print-area"
        className="min-h-64 rounded-b-xl border border-t-0 bg-white p-6 text-gray-900 print:border-none print:p-0"
      >
        <div className="break-after-avoid border-b border-gray-200 pb-3 print:break-after-avoid">
          <div className="flex items-start justify-between gap-6">
            <div className="flex min-w-0 items-start gap-3 text-left">
              <div className="flex h-10 w-20 shrink-0 items-center justify-start overflow-hidden bg-white">
                {company.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logo} alt={company.name} className="max-h-10 max-w-20 object-contain" />
                ) : (
                  <div className="text-lg font-black tracking-tight text-gray-900">
                    {company.name.slice(0, 4).toUpperCase()}.
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-950">
                  {company.name}
                </h2>
                <div className="mt-0.5 space-y-0.5 text-[11px] leading-4 text-gray-500">
                  {company.phone ? <div>Phone: {company.phone}</div> : null}
                  {company.address ? <div>{company.address}</div> : null}
                </div>
              </div>
            </div>

            <div className="shrink-0 text-right text-[11px] leading-4 text-gray-500">
              <div>Generated: <span className="font-medium text-gray-800">{generatedAt}</span></div>
              <div>Records: <span className="font-medium text-gray-800">{(totalRows ?? rows).length}</span></div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <h3 className="text-sm font-bold text-gray-950">{title}</h3>
            <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
              {activeFilterLabel ?? 'Filters: All'}
            </p>
          </div>
        </div>

        <div className="report-table-wrap mt-3 w-full overflow-x-auto rounded-md border border-gray-200 bg-white print:break-before-auto print:overflow-visible print:border-none">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      'h-8 whitespace-nowrap border-b border-gray-200 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600',
                      alignClass[column.align ?? 'left'],
                    )}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-b border-gray-100 hover:bg-white">
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        'px-2.5 py-2 text-[11px] leading-4 text-gray-800',
                        alignClass[column.align ?? 'left'],
                      )}
                    >
                      {formatCell(row[column.key], column.format)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            {totals.length > 0 && (
              <TableFooter>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  {columns.map((column, index) => {
                    const isTotal = totals.includes(column.key)
                    return (
                      <TableCell
                        key={column.key}
                        className={cn(
                          'px-2.5 py-2 text-[11px] font-semibold text-gray-900',
                          alignClass[column.align ?? 'left'],
                        )}
                      >
                        {index === 0
                          ? ''
                          : isTotal
                            ? formatCell(totalMap[column.key], column.format)
                            : column.key === columns[1]?.key
                              ? 'Total'
                              : ''}
                      </TableCell>
                    )
                  })}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
          <span className="text-[11px] text-gray-400">1 of 1</span>
          <span className="text-[11px] text-gray-400">Copyright &copy; {year} {company.name}</span>
        </div>
      </div>
    </div>
  )
}


