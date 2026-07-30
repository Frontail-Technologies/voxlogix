'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  RefreshCw,
} from 'lucide-react'

interface ViewerToolbarProps {
  onZoomChange: (zoom: number) => void
  zoom: number
  onExportPDF: () => void
  onExportExcel: () => void
  onPrint: () => void
  onRefresh: () => void
  onPageChange?: (page: number) => void
  totalPages?: number
  currentPage?: number
}

const ZOOM_OPTIONS = [
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1 },
  { label: '125%', value: 1.25 },
  { label: '150%', value: 1.5 },
]

export function ViewerToolbar({
  onZoomChange,
  zoom,
  onExportPDF,
  onExportExcel,
  onPrint,
  onRefresh,
  onPageChange,
  totalPages = 1,
  currentPage = 1,
}: ViewerToolbarProps) {
  const canGoBack = currentPage > 1
  const canGoForward = currentPage < totalPages

  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-t-xl border border-b-0 bg-muted/40 px-3 py-2">
      {/* Pagination */}
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!canGoBack} onClick={() => onPageChange?.(1)}>
          <ChevronFirst className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!canGoBack} onClick={() => onPageChange?.(currentPage - 1)}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
          <span className="border rounded px-2 py-0.5 bg-background min-w-[28px] text-center font-medium text-foreground">
            {currentPage}
          </span>
          <span>of {totalPages}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!canGoForward} onClick={() => onPageChange?.(currentPage + 1)}>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!canGoForward} onClick={() => onPageChange?.(totalPages)}>
          <ChevronLast className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mx-1 h-5 w-px shrink-0 bg-border" />

      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRefresh} title="Refresh">
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>

      <div className="mx-1 h-5 w-px shrink-0 bg-border" />

      {/* Zoom */}
      <Select
        value={String(zoom)}
        onValueChange={(v) => onZoomChange(Number(v))}
      >
        <SelectTrigger className="h-7 min-w-20 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ZOOM_OPTIONS.map((z) => (
            <SelectItem key={z.value} value={String(z.value)} className="text-xs">
              {z.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mx-1 h-5 w-px shrink-0 bg-border" />

      {/* Export */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Download className="h-3 w-3" />
          Export
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onExportPDF} className="gap-2 text-sm cursor-pointer">
            <FileText className="h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportExcel} className="gap-2 text-sm cursor-pointer">
            <FileSpreadsheet className="h-4 w-4" />
            Export as Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onPrint}
        title="Print"
      >
        <Printer className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}


