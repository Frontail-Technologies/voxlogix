'use client'

import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { FilterPanel } from './FilterPanel'
import { ViewerToolbar } from './ViewerToolbar'
import { ReportFrame } from './ReportFrame'
import { exportPDF } from './exportPDF'
import { exportExcel } from './exportExcel'
import { ReportViewerProps, ReportRow } from './types'

const PAGE_SIZE = 20

function slugifyFilename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function datedFilename(value: string) {
  const date = new Date().toISOString().slice(0, 10)
  return `${slugifyFilename(value) || 'report'}_${date}`
}

function printReportElement(title: string) {
  const reportElement = document.getElementById('report-print-area')
  if (!reportElement) return

  const printWindow = window.open('', '_blank', 'width=1200,height=800')
  if (!printWindow) return

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join('\n')

  printWindow.document.open()
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        ${styles}
        <style>
          @page { size: landscape; margin: 9mm; }
          html, body { margin: 0; background: #ffffff; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          #print-root { width: 100%; }
          #print-root #report-print-area {
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          #print-root > div {
            transform: none !important;
            width: 100% !important;
          }
          #print-root .report-table-wrap {
            display: block !important;
            page-break-before: auto !important;
            break-before: auto !important;
          }
          #print-root #report-print-area > div:first-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        </style>
      </head>
      <body>
        <div id="print-root">${reportElement.outerHTML}</div>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()

  window.setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

export function ReportViewer({
  title,
  filters,
  columns,
  fetchData,
  company,
  totals = [],
  filename,
}: ReportViewerProps) {
  const [rows, setRows] = useState<ReportRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [page, setPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({})

  const totalPages = Math.max(1, Math.ceil((rows?.length ?? 0) / PAGE_SIZE))
  const pageRows = useMemo(() => {
    if (!rows) return []
    return rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  }, [page, rows])

  async function handleGenerate(filterValues: Record<string, string | string[]>) {
    setLoading(true)
    setActiveFilters(filterValues)
    try {
      const data = await fetchData(filterValues)
      setPage(1)
      setRows(data)
    } catch (err) {
      console.error('ReportViewer: fetchData failed', err)
      setPage(1)
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  function handleRefresh() {
    if (Object.keys(activeFilters).length > 0) {
      handleGenerate(activeFilters)
    }
  }

  function buildFilterLabel(): string {
    const parts: string[] = []
    filters.forEach((f) => {
      const val = activeFilters[f.key]
      if (!val || val === 'all' || (Array.isArray(val) && val.length === 0)) return

      if (f.type === 'daterange' && Array.isArray(val)) {
        const [from, to] = val
        if (from || to) parts.push(`${f.label}: ${from || 'Start'} to ${to || 'Now'}`)
        return
      }

      if (Array.isArray(val)) {
        const labels = val
          .map((item) => f.options?.find((o) => o.value === item)?.label ?? item)
          .join(', ')
        if (labels) parts.push(`${f.label}: ${labels}`)
        return
      }

      if (typeof val === 'string') {
        const opt = f.options?.find((o) => o.value === val)
        parts.push(`${f.label}: ${opt?.label ?? val}`)
      }
    })
    return parts.length > 0 ? parts.join(' | ') : 'Filters: All'
  }

  const reportFilename = datedFilename(filename ?? title)

  return (
    <div className="space-y-4">
      <div className="print:hidden">
        <FilterPanel filters={filters} onGenerate={handleGenerate} loading={loading} />
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating report...
        </div>
      )}

      {!loading && rows !== null && rows.length === 0 && (
        <div className="flex items-center justify-center rounded-xl border bg-muted/20 py-16 text-sm text-muted-foreground">
          No records found for the selected filters.
        </div>
      )}

      {!loading && rows !== null && rows.length > 0 && (
        <div className="print:shadow-none">
          <div className="print:hidden">
            <ViewerToolbar
              zoom={zoom}
              onZoomChange={setZoom}
              onRefresh={handleRefresh}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onExportPDF={async () =>
                await exportPDF({ title, columns, rows, totals, company, filename: reportFilename })
              }
              onExportExcel={() =>
                exportExcel({ title, columns, rows, totals, company, filename: reportFilename })
              }
              onPrint={() => printReportElement(reportFilename)}
            />
          </div>
          <div className="overflow-x-auto rounded-b-xl border-x border-b print:overflow-visible print:border-none">
            <ReportFrame
              title={title}
              columns={columns}
              rows={pageRows}
              totalRows={rows}
              totals={totals}
              company={company}
              zoom={zoom}
              activeFilterLabel={buildFilterLabel()}
            />
          </div>
        </div>
      )}
    </div>
  )
}



