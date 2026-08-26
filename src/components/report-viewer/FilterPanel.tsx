'use client'

import { useEffect, useState } from 'react'
import { CalendarIcon, Loader2, RotateCcw, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'

import { FilterConfig, FilterOption } from './types'

interface FilterPanelProps {
  filters: FilterConfig[]
  onGenerate: (values: Record<string, string | string[]>) => void
  loading: boolean
}

type DateRangeValue = [string, string]

function toDate(value?: string) {
  if (!value) return undefined
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function toDateValue(date?: Date) {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateLabel(value?: string) {
  const date = toDate(value)
  if (!date) return 'Pick date'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function DatePickerButton({
  value,
  placeholder,
  onChange,
}: {
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex h-10 flex-1 items-center justify-start gap-2 rounded-lg border border-input bg-secondary/60 px-3 text-left text-sm transition-colors hover:bg-secondary/80">
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className={cn('truncate', !value && 'text-muted-foreground')}>
          {value ? formatDateLabel(value) : placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={toDate(value)}
          onSelect={(date) => onChange(toDateValue(date))}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}

function getInitialValues(filters: FilterConfig[]) {
  const init: Record<string, string | string[]> = {}
  filters.forEach((filter) => {
    if (filter.defaultValue !== undefined) {
      init[filter.key] = filter.defaultValue
    } else if (filter.type === 'multiselect') {
      init[filter.key] = []
    } else if (filter.type === 'radio') {
      init[filter.key] = filter.options?.[0]?.value ?? 'all'
    } else if (filter.type === 'daterange') {
      init[filter.key] = ['', '']
    } else {
      init[filter.key] = 'all'
    }
  })
  return init
}

export function FilterPanel({ filters, onGenerate, loading }: FilterPanelProps) {
  const [values, setValues] = useState<Record<string, string | string[]>>(() => getInitialValues(filters))

  const [dynamicOptions, setDynamicOptions] = useState<Record<string, FilterOption[]>>({})
  const [optionsLoading, setOptionsLoading] = useState<Record<string, boolean>>({})
  const errors = getFilterErrors(filters, values)
  const hasErrors = Object.keys(errors).length > 0

  useEffect(() => {
    filters.forEach((filter) => {
      if (filter.fetchOptions && !filter.dependsOn) loadOptions(filter)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadOptions(filter: FilterConfig) {
    if (!filter.fetchOptions) return
    setOptionsLoading((prev) => ({ ...prev, [filter.key]: true }))
    try {
      const options = await filter.fetchOptions()
      setDynamicOptions((prev) => ({ ...prev, [filter.key]: options }))
    } finally {
      setOptionsLoading((prev) => ({ ...prev, [filter.key]: false }))
    }
  }

  function handleChange(key: string, value: string | string[]) {
    setValues((prev) => ({ ...prev, [key]: value }))

    filters
      .filter((filter) => filter.dependsOn === key)
      .forEach((filter) => {
        if (filter.fetchOptions) loadOptions(filter)
      })
  }

  function handleRangeChange(key: string, index: 0 | 1, value: string) {
    const current = ((values[key] as string[]) ?? ['', '']) as DateRangeValue
    const next: DateRangeValue = index === 0 ? [value, current[1] ?? ''] : [current[0] ?? '', value]
    handleChange(key, next)
  }

  function toggleMulti(key: string, value: string) {
    const current = (values[key] as string[]) ?? []
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    handleChange(key, next)
  }

  function getOptions(filter: FilterConfig): FilterOption[] {
    return dynamicOptions[filter.key] ?? filter.options ?? []
  }


  function handleReset() {
    setValues(getInitialValues(filters))
  }

  return (
    <div className="space-y-5 rounded-xl border bg-card p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filters
          .filter((filter) => filter.type !== 'radio')
          .map((filter) => {
            const options = getOptions(filter)
            const isLoading = optionsLoading[filter.key]
            const selectedValue = values[filter.key] as string
            const selectedLabel = options.find((option) => option.value === selectedValue)?.label
            const error = errors[filter.key]

            return (
              <div key={filter.key} className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  {filter.label}
                  {filter.required && <span className="ml-0.5 text-destructive">*</span>}
                </Label>

                {filter.type === 'select' && (
                  <Select
                    value={selectedValue}
                    onValueChange={(value) => handleChange(filter.key, value ?? '')}
                  >
                    <SelectTrigger className="h-10 w-full bg-secondary/60">
                      {isLoading ? (
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin" /> Loading...
                        </span>
                      ) : (
                        <span className={cn('truncate', !selectedLabel && 'text-muted-foreground')}>{selectedLabel ?? `Select ${filter.label}`}</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {filter.type === 'multiselect' && (
                  <div className="space-y-2">
                    <div className="flex min-h-10 flex-wrap gap-1.5 rounded-md border bg-secondary/60 px-3 py-2">
                      {((values[filter.key] as string[]) ?? []).length === 0 ? (
                        <span className="self-center text-sm text-muted-foreground">
                          Select {filter.label}...
                        </span>
                      ) : (
                        (values[filter.key] as string[]).map((value) => {
                          const option = options.find((item) => item.value === value)
                          return (
                            <Badge key={value} variant="secondary" className="gap-1 text-xs">
                              {option?.label ?? value}
                              <button
                                type="button"
                                onClick={() => toggleMulti(filter.key, value)}
                                className="hover:text-destructive"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </Badge>
                          )
                        })
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 rounded-md border bg-popover p-1.5">
                      {options.map((option) => {
                        const selected = ((values[filter.key] as string[]) ?? []).includes(option.value)
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleMulti(filter.key, option.value)}
                            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${selected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {filter.type === 'daterange' && (() => {
                  const range = ((values[filter.key] as string[]) ?? ['', '']) as DateRangeValue
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <DatePickerButton
                          value={range[0] ?? ''}
                          placeholder="From"
                          onChange={(value) => handleRangeChange(filter.key, 0, value)}
                        />
                        <span className="text-xs font-medium text-muted-foreground">to</span>
                        <DatePickerButton
                          value={range[1] ?? ''}
                          placeholder="To"
                          onChange={(value) => handleRangeChange(filter.key, 1, value)}
                        />
                      </div>
                      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
                    </>
                  )
                })()}
              </div>
            )
          })}
      </div>

      {filters
        .filter((filter) => filter.type === 'radio')
        .map((filter) => (
          <div key={filter.key} className="flex flex-wrap items-center gap-2">
            <Label className="shrink-0 text-sm font-medium text-foreground">{filter.label}:</Label>
            {(filter.options ?? []).map((option) => {
              const selected = values[filter.key] === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange(filter.key, option.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-secondary/60 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        ))}

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={loading || hasErrors}
          className="rounded-xl px-4 text-xs font-semibold uppercase tracking-wide"
        >
          <RotateCcw className="mr-2 size-3.5" />
          Reset Filters
        </Button>
        <Button
          onClick={() => onGenerate(values)}
          disabled={loading}
          className="rounded-xl bg-primary px-6 text-xs font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
        >
          {loading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          Generate Report
        </Button>
      </div>
    </div>
  )
}

function getFilterErrors(filters: FilterConfig[], values: Record<string, string | string[]>) {
  const errors: Record<string, string> = {}

  filters.forEach((filter) => {
    if (filter.type !== 'daterange') return
    const [fromDate = '', toDate = ''] = ((values[filter.key] as string[]) ?? ['', '']) as DateRangeValue
    if (filter.required && (!fromDate || !toDate)) {
      errors[filter.key] = 'Select both dates.'
      return
    }
    if (fromDate && toDate && fromDate > toDate) {
      errors[filter.key] = 'From date cannot be after To date.'
    }
  })

  return errors
}






