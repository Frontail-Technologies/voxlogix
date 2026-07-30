import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ColumnConfig, CompanyInfo, ReportRow } from "./types";

const DEFAULT_PDF_FONT = "helvetica";
const KHMER_PDF_FONT = "NotoSansKhmer";
const KHMER_FONT_PATHS = [
  "/fonts/NotoSansKhmer-Regular.ttf",
  "/fonts/NotoSansKhmer.ttf",
  "/fonts/KhmerOS.ttf",
];
const PAGE_MARGIN = 10;

function formatCell(
  value: string | number,
  format?: ColumnConfig["format"],
): string {
  if (value === undefined || value === null) return "";
  if (format === "currency") {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (format === "number") return Number(value).toLocaleString();
  return String(value);
}

async function getBase64ImageFromURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return window.btoa(binary);
}

async function loadPdfUnicodeFont(doc: jsPDF): Promise<string> {
  for (const fontPath of KHMER_FONT_PATHS) {
    try {
      const response = await fetch(fontPath);
      if (!response.ok) continue;

      const fontBase64 = arrayBufferToBase64(await response.arrayBuffer());
      const fontFileName = fontPath.split("/").pop() || "khmer-font.ttf";

      doc.addFileToVFS(fontFileName, fontBase64);
      doc.addFont(fontFileName, KHMER_PDF_FONT, "normal");
      doc.addFont(fontFileName, KHMER_PDF_FONT, "bold");

      return KHMER_PDF_FONT;
    } catch (error) {
      console.warn(`Failed to load PDF font from ${fontPath}`, error);
    }
  }

  console.warn(
    "Khmer PDF font not found. Add NotoSansKhmer-Regular.ttf to public/fonts for Khmer PDF export.",
  );
  return DEFAULT_PDF_FONT;
}

function tableFontSize(columnCount: number) {
  if (columnCount >= 14) return 5.8;
  if (columnCount >= 11) return 6.4;
  if (columnCount >= 8) return 7;
  return 8;
}

function tableCellPadding(columnCount: number) {
  if (columnCount >= 12) return 1.3;
  if (columnCount >= 9) return 1.7;
  return 2.4;
}

function columnAlign(column: ColumnConfig) {
  if (column.align) return column.align;
  if (column.format === "number" || column.format === "currency") return "right";
  return "left";
}

function calculateColumnStyles({
  columns,
  rows,
  usableWidth,
}: {
  columns: ColumnConfig[];
  rows: ReportRow[];
  usableWidth: number;
}) {
  const minWidth = columns.length >= 14 ? 7.5 : columns.length >= 11 ? 9 : 12;
  const maxWidth = columns.length >= 12 ? 25 : 38;
  const rawWidths = columns.map((column) => {
    const sampleLength = Math.max(
      column.label.length,
      ...rows.slice(0, 25).map((row) => String(row[column.key] ?? "").length),
    );
    const preferred =
      column.format === "number" || column.format === "currency"
        ? 14
        : Math.min(maxWidth, Math.max(minWidth, sampleLength * 1.35));

    return Math.max(minWidth, Math.min(maxWidth, preferred));
  });
  const rawTotal = rawWidths.reduce((sum, width) => sum + width, 0);
  const minTotal = minWidth * columns.length;
  const scaledWidths =
    minTotal > usableWidth
      ? columns.map(() => usableWidth / columns.length)
      : rawWidths.map((width) => width * (usableWidth / rawTotal));

  return columns.reduce(
    (acc, column, index) => {
      acc[index] = {
        cellWidth: scaledWidths[index],
        halign: columnAlign(column),
      };
      return acc;
    },
    {} as Record<number, object>,
  );
}

function shouldUseLandscape(columns: ColumnConfig[], rows: ReportRow[]) {
  if (columns.length > 10) return true;

  const longTextColumns = columns.filter((column) => {
    const maxLength = Math.max(
      column.label.length,
      ...rows.slice(0, 20).map((row) => String(row[column.key] ?? "").length),
    );

    return maxLength > 28 && column.format !== "number" && column.format !== "currency";
  });

  return columns.length >= 9 && longTextColumns.length >= 3;
}

export async function exportPDF({
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
  const orientation = shouldUseLandscape(columns, rows) ? "landscape" : "portrait";
  const doc = new jsPDF({ orientation, format: "a4", unit: "mm" });
  const pdfFont = await loadPdfUnicodeFont(doc);
  const year = new Date().getFullYear();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const usableWidth = pageWidth - PAGE_MARGIN * 2;
  const fontSize = tableFontSize(columns.length);
  const cellPadding = tableCellPadding(columns.length);
  const columnStyles = calculateColumnStyles({ columns, rows, usableWidth });

  // Compact header
  if (company.logo) {
    try {
      const base64Logo = await getBase64ImageFromURL(company.logo);
      doc.addImage(base64Logo, "PNG", PAGE_MARGIN, 7, 15, 10, undefined, "FAST");
    } catch (error) {
      console.error("Failed to load logo for PDF:", error);
      doc.setFontSize(11);
      doc.setFont(pdfFont, "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`${company.name.slice(0, 4).toUpperCase()}.`, PAGE_MARGIN, 14);
    }
  } else {
    doc.setFontSize(11);
    doc.setFont(pdfFont, "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`${company.name.slice(0, 4).toUpperCase()}.`, PAGE_MARGIN, 14);
  }

  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.setFont(pdfFont, "bold");
  doc.text(company.name.toUpperCase(), PAGE_MARGIN + 20, 10);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont(pdfFont, "normal");
  doc.text(company.address || "Operational report", PAGE_MARGIN + 20, 14);

  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Date: ${new Date().toLocaleDateString("en-GB")}`,
    pageWidth - PAGE_MARGIN,
    10,
    { align: "right" },
  );
  if (company.phone) {
    doc.text(`Phone: ${company.phone}`, pageWidth - PAGE_MARGIN, 14, {
      align: "right",
    });
  }

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(PAGE_MARGIN, 20, pageWidth - PAGE_MARGIN, 20);

  doc.setFontSize(10);
  doc.setFont(pdfFont, "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(title, PAGE_MARGIN, 27);

  // Build totals row
  let footRow: string[] | null = null;
  if (totals && totals.length > 0) {
    footRow = columns.map((col) => {
      if (totals.includes(col.key)) {
        const sum = rows.reduce((s, r) => s + Number(r[col.key] || 0), 0);
        return formatCell(sum, col.format);
      }
      if (col.key === columns[0].key) return "Total";
      return "";
    });
  }

  autoTable(doc, {
    startY: 31,
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN, top: 12, bottom: 14 },
    tableWidth: usableWidth,
    head: [columns.map((c) => c.label.toUpperCase())],
    body: rows.map((row) =>
      columns.map((col) => formatCell(row[col.key], col.format)),
    ),
    foot: footRow ? [footRow] : undefined,
    theme: "grid",
    styles: {
      fontSize,
      cellPadding,
      minCellHeight: 5,
      textColor: [51, 65, 85], // slate-700
      lineColor: [226, 232, 240], // slate-200
      lineWidth: 0.1,
      font: pdfFont,
      fontStyle: "normal",
      overflow: "linebreak",
      valign: "middle",
      halign: "left",
    },
    headStyles: {
      fillColor: [246, 183, 25],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: Math.max(5.6, fontSize - 0.2),
      halign: "center",
    },
    footStyles: {
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      halign: "right",
    },
    columnStyles,
    alternateRowStyles: { fillColor: [251, 248, 241] },
    didParseCell: (data) => {
      // Color-code the currency columns (Positive = Green, Negative = Red)
      if (data.section === "body") {
        const col = columns[data.column.index];
        if (col && col.format === "currency") {
          const rawVal = rows[data.row.index][col.key];
          const num = Number(rawVal || 0);
          if (num < 0) {
            data.cell.styles.textColor = [239, 68, 68]; // red-500
          } else if (num > 0) {
            data.cell.styles.textColor = [16, 185, 129]; // emerald-500
          }
        }
      } else if (data.section === "foot" && totals.length > 0) {
        const col = columns[data.column.index];
        if (col && col.format === "currency" && totals.includes(col.key)) {
          const sum = rows.reduce((s, r) => s + Number(r[col.key] || 0), 0);
          if (sum < 0) {
            data.cell.styles.textColor = [239, 68, 68];
          } else if (sum > 0) {
            data.cell.styles.textColor = [16, 185, 129];
          }
        }
      }
    },
    didDrawPage: () => {
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      doc.setFontSize(7);
      doc.setFont(pdfFont, "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(`${pageNumber}`, PAGE_MARGIN, pageHeight - 7);
      doc.text(`Copyright © ${year} ${company.name}`, pageWidth - PAGE_MARGIN, pageHeight - 7, {
        align: "right",
      });
    },
  });

  doc.save(`${filename}.pdf`);
}


