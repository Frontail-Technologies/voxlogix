'use client'

import { useMemo, useState } from 'react'
import { Loader2, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage, showApiErrorToast } from '@/lib/api/error-toast'

import { FilterPanel } from './FilterPanel'
import { ViewerToolbar } from './ViewerToolbar'
import { ReportFrame } from './ReportFrame'
import { exportPDF } from './exportPDF'
import { exportExcel } from './exportExcel'
import { ReportViewerProps, ReportRow } from './types'

const PAGE_SIZE = 20

type ReportRequestStatus = 'idle' | 'loading' | 'success' | 'error'

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
  const [rows, setRows] = useState<ReportRow[]>([])
  const [requestStatus, setRequestStatus] = useState<ReportRequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [page, setPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({})

  const loading = requestStatus === 'loading'
  const latestRequestFailed = requestStatus === 'error'
  const hasSuccessfulRows = requestStatus === 'success' && rows.length > 0
  const hasSuccessfulEmptyResult = requestStatus === 'success' && rows.length === 0
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pageRows = useMemo(() => rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [page, rows])

  async function handleGenerate(filterValues: Record<string, string | string[]>) {
    setRequestStatus('loading')
    setError(null)
    setRows([])
    setActiveFilters(filterValues)

    try {
      const data = await fetchData(filterValues)
      setPage(1)
      setRows(data)
      setRequestStatus('success')
    } catch (err) {
      console.error('ReportViewer: fetchData failed', err)
      setPage(1)
      setRows([])
      setError(getApiErrorMessage(err, 'Could not generate this report. Please try again.'))
      setRequestStatus('error')
      showApiErrorToast(err, 'Could not generate this report')
    }
  }

  function handleRefresh() {
    if (Object.keys(activeFilters).length > 0) {
      void handleGenerate(activeFilters)
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

      {!loading && latestRequestFailed && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-16 text-center text-sm">
          <TriangleAlert className="h-5 w-5 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium text-destructive">Could not generate report.</p>
            <p className="max-w-md whitespace-pre-line text-muted-foreground">{error}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      )}

      {!loading && hasSuccessfulEmptyResult && (
        <div className="flex items-center justify-center rounded-xl border bg-muted/20 py-16 text-sm text-muted-foreground">
          No records found for the selected filters.
        </div>
      )}

      {!loading && hasSuccessfulRows && (
        <div className="print:shadow-none">
          <div className="print:hidden">
            <ViewerToolbar
              zoom={zoom}
              onZoomChange={setZoom}
              onRefresh={handleRefresh}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onExportPDF={async () => {
                if (latestRequestFailed || rows.length === 0) return
                await exportPDF({ title, columns, rows, totals, company, filename: reportFilename })
              }}
              onExportExcel={() => {
                if (latestRequestFailed || rows.length === 0) return
                exportExcel({ title, columns, rows, totals, company, filename: reportFilename })
              }}
              onPrint={() => {
                if (latestRequestFailed || rows.length === 0) return
                printReportElement(reportFilename)
              }}
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
