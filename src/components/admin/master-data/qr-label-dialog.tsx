"use client";

import QRCode from "qrcode";
import { Download, Printer, QrCode } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type QrLabelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "measuring-point" | "meter-counter";
  code: string;
  title: string;
  subtitle?: string | null;
  locationLabel?: string | null;
};

function labelFor(type: QrLabelDialogProps["type"]) {
  return type === "measuring-point" ? "MEASURING POINT" : "METER COUNTER";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildReadingQrPayload(type: QrLabelDialogProps["type"], code: string) {
  const query = new URLSearchParams({ v: "1", type, id: code });
  return `voxlogix://reading?${query.toString()}`;
}

export function QrLabelDialog({
  open,
  onOpenChange,
  type,
  code,
  title,
  subtitle,
  locationLabel,
}: QrLabelDialogProps) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const payload = useMemo(() => buildReadingQrPayload(type, code), [code, type]);
  const kindLabel = labelFor(type);

  useEffect(() => {
    let cancelled = false;
    void QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: { dark: "#111827", light: "#ffffff" },
    }).then((dataUrl) => {
      if (!cancelled) setQrDataUrl(dataUrl);
    });

    return () => {
      cancelled = true;
    };
  }, [payload]);

  function downloadLabel() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${code.toLowerCase()}-qr.png`;
    link.click();
  }

  function printLabel() {
    if (!qrDataUrl) return;
    const popup = window.open("", "_blank", "width=420,height=620");
    if (!popup) return;
    const safeCode = escapeHtml(code);
    const safeTitle = escapeHtml(title);
    const safeSubtitle = subtitle ? escapeHtml(subtitle) : "";
    const safeLocationLabel = locationLabel ? escapeHtml(locationLabel) : "";
    const safeKindLabel = escapeHtml(kindLabel);
    const safeQrDataUrl = escapeHtml(qrDataUrl);

    popup.document.write(`
      <html>
        <head>
          <title>${safeCode} QR</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #111827; }
            .label { width: 320px; border: 1px solid #d8d2c5; border-radius: 14px; padding: 18px; text-align: center; }
            .brand { font-size: 18px; font-weight: 700; color: #f8b51e; margin-bottom: 12px; }
            .kind { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #6b7280; }
            .code { margin-top: 6px; font-size: 24px; font-weight: 700; }
            .title { margin-top: 6px; font-size: 13px; }
            .subtitle { margin-top: 4px; font-size: 12px; color: #4b5563; }
            img { width: 220px; height: 220px; margin-top: 16px; }
            @media print { body { padding: 0; } .label { border-color: #111827; } }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="brand">VoxLogiX</div>
            <div class="kind">${safeKindLabel}</div>
            <div class="code">${safeCode}</div>
            <div class="title">${safeTitle}</div>
            ${safeSubtitle ? `<div class="subtitle">Equipment: ${safeSubtitle}</div>` : ""}
            ${safeLocationLabel ? `<div class="subtitle">${safeLocationLabel}</div>` : ""}
            <img src="${safeQrDataUrl}" alt="${safeCode} QR" />
          </div>
          <script>window.onload = () => { window.print(); window.close(); };</script>
        </body>
      </html>
    `);
    popup.document.close();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="size-4 text-primary" />
            QR Label
          </DialogTitle>
        </DialogHeader>
        <div className="rounded-2xl border bg-secondary/40 p-4 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{kindLabel}</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{code}</p>
          <p className="mt-1 text-sm text-muted-foreground">{title}</p>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">Equipment: {subtitle}</p> : null}
          {locationLabel ? <p className="mt-1 text-xs text-muted-foreground">{locationLabel}</p> : null}
          <div className="mt-4 flex justify-center">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt={`${code} QR`} className="size-56 rounded-xl bg-white p-2" />
            ) : (
              <div className="flex size-56 items-center justify-center rounded-xl bg-background text-sm text-muted-foreground">
                Generating...
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={printLabel}>
            <Printer className="size-4" />
            Print
          </Button>
          <Button onClick={downloadLabel}>
            <Download className="size-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
