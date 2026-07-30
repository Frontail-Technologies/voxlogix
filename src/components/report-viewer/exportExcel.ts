import ExcelJS from "exceljs";

import { ColumnConfig, CompanyInfo, ReportRow } from "./types";

const BRAND = "F6B719";
const INK = "0F172A";
const MUTED = "64748B";
const BORDER = "D8D2C4";
const SURFACE = "F7F3EA";
const ROW_ALT = "FBF8F1";
const WHITE = "FFFFFF";

function formatCell(value: string | number, format?: ColumnConfig["format"]): string | number {
  if (value === undefined || value === null) return "";
  if (format === "currency" || format === "number") return Number(value) || 0;
  return String(value);
}

function numberFormat(format?: ColumnConfig["format"]) {
  if (format === "currency") return '"$"#,##0.00';
  if (format === "number") return '#,##0';
  return undefined;
}

function alignmentFor(column: ColumnConfig): Partial<ExcelJS.Alignment> {
  return {
    horizontal: column.align ?? (column.format === "number" || column.format === "currency" ? "right" : "left"),
    vertical: "middle",
    wrapText: true,
  };
}

function downloadWorkbook(buffer: ExcelJS.Buffer, filename: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function exportExcel({
  title,
  columns,
  rows,
  totals = [],
  company,
  filename = "report",
}: {
  title: string;
  columns: ColumnConfig[];
  rows: ReportRow[];
  totals?: string[];
  company: CompanyInfo;
  filename?: string;
}) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title.substring(0, 31), {
    views: [{ state: "frozen", ySplit: 6 }],
    pageSetup: {
      orientation: columns.length > 7 ? "landscape" : "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.35,
        right: 0.35,
        top: 0.45,
        bottom: 0.45,
        header: 0.2,
        footer: 0.2,
      },
    },
  });
  const totalColumns = Math.max(columns.length, 4);
  const generatedAt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

  workbook.creator = "VoxLogiX";
  workbook.created = new Date();
  workbook.modified = new Date();

  worksheet.mergeCells(1, 1, 1, totalColumns);
  const titleCell = worksheet.getCell(1, 1);
  titleCell.value = company.name;
  titleCell.font = { bold: true, color: { argb: WHITE }, size: 16 };
  titleCell.alignment = { horizontal: "left", vertical: "middle" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
  worksheet.getRow(1).height = 28;

  worksheet.mergeCells(2, 1, 2, Math.max(2, totalColumns - 2));
  worksheet.getCell(2, 1).value = company.address || "Operational report";
  worksheet.getCell(2, 1).font = { color: { argb: MUTED }, size: 10 };
  worksheet.getCell(2, 1).alignment = { vertical: "middle" };

  worksheet.mergeCells(2, Math.max(3, totalColumns - 1), 2, totalColumns);
  worksheet.getCell(2, Math.max(3, totalColumns - 1)).value = `Generated: ${generatedAt}`;
  worksheet.getCell(2, Math.max(3, totalColumns - 1)).font = { color: { argb: MUTED }, size: 10 };
  worksheet.getCell(2, Math.max(3, totalColumns - 1)).alignment = { horizontal: "right", vertical: "middle" };

  worksheet.mergeCells(3, 1, 3, totalColumns);
  const reportTitleCell = worksheet.getCell(3, 1);
  reportTitleCell.value = title;
  reportTitleCell.font = { bold: true, color: { argb: INK }, size: 13 };
  reportTitleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(3).height = 24;

  const headerRowIndex = 5;
  const headerRow = worksheet.getRow(headerRowIndex);
  headerRow.values = columns.map((column) => column.label.toUpperCase());
  headerRow.height = 24;

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: INK }, size: 10 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: BRAND } },
      bottom: { style: "thin", color: { argb: "C7960D" } },
      left: { style: "thin", color: { argb: "C7960D" } },
      right: { style: "thin", color: { argb: "C7960D" } },
    };
  });

  rows.forEach((row, rowIndex) => {
    const excelRow = worksheet.addRow(
      columns.map((column) => formatCell(row[column.key], column.format)),
    );
    const isAlt = rowIndex % 2 === 1;

    excelRow.height = 24;
    excelRow.eachCell((cell, columnNumber) => {
      const column = columns[columnNumber - 1];
      const numFmt = numberFormat(column.format);

      cell.font = { color: { argb: INK }, size: 10 };
      cell.alignment = alignmentFor(column);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: isAlt ? ROW_ALT : WHITE } };
      cell.border = {
        bottom: { style: "thin", color: { argb: "E9E3D7" } },
      };
      if (numFmt) cell.numFmt = numFmt;
    });
  });

  if (totals.length > 0) {
    const totalsRow = worksheet.addRow(
      columns.map((column) => {
        if (totals.includes(column.key)) {
          return rows.reduce((sum, row) => sum + Number(row[column.key] || 0), 0);
        }
        return column.key === columns[0].key ? "Total" : "";
      }),
    );

    totalsRow.height = 25;
    totalsRow.eachCell((cell, columnNumber) => {
      const column = columns[columnNumber - 1];
      const numFmt = numberFormat(column.format);

      cell.font = { bold: true, color: { argb: INK }, size: 10 };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: SURFACE } };
      cell.alignment = alignmentFor(column);
      cell.border = {
        top: { style: "thin", color: { argb: BORDER } },
        bottom: { style: "thin", color: { argb: BORDER } },
      };
      if (numFmt) cell.numFmt = numFmt;
    });
  }

  const footerRow = worksheet.addRow([]);
  const copyrightRow = worksheet.addRow([`Copyright © ${new Date().getFullYear()} ${company.name}`]);

  footerRow.height = 8;
  worksheet.mergeCells(copyrightRow.number, 1, copyrightRow.number, totalColumns);
  copyrightRow.getCell(1).font = { color: { argb: MUTED }, size: 9 };
  copyrightRow.getCell(1).alignment = { horizontal: "right" };

  columns.forEach((column, index) => {
    const width = Math.max(
      column.label.length + 4,
      ...rows.map((row) => String(row[column.key] ?? "").length + 2),
    );
    worksheet.getColumn(index + 1).width = Math.min(Math.max(width, 12), 34);
  });

  worksheet.autoFilter = {
    from: { row: headerRowIndex, column: 1 },
    to: { row: Math.max(headerRowIndex, headerRowIndex + rows.length), column: columns.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  downloadWorkbook(buffer, filename);
}
