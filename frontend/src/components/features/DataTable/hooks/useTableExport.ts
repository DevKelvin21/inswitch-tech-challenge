import { useCallback } from 'react'
import type { ExportFormat, ColumnConfig } from '../../../../types/table.types'

export function useTableExport<T>(data: T[], columns: ColumnConfig<T>[]) {
  const exportToCSV = useCallback(() => {
    const headers = columns.map((col) => col.header).join(',')

    const rows = data.map((row) => {
      return columns
        .map((col) => {
          const value = row[col.accessorKey]
          const stringValue = String(value ?? '')
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        .join(',')
    })

    const csv = [headers, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `table-export-${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [data, columns])

  const exportToJSON = useCallback(() => {
    const exportData = data.map((row) => {
      const obj: Record<string, unknown> = {}
      columns.forEach((col) => {
        obj[col.header] = row[col.accessorKey]
      })
      return obj
    })

    const json = JSON.stringify(exportData, null, 2)

    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `table-export-${Date.now()}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [data, columns])

  const exportData = useCallback(
    (format: ExportFormat) => {
      if (format === 'csv') {
        exportToCSV()
      } else if (format === 'json') {
        exportToJSON()
      }
    },
    [exportToCSV, exportToJSON]
  )

  return {
    exportToCSV,
    exportToJSON,
    exportData,
  }
}
