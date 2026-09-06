"use client";

import { Check } from "lucide-react";
import { useMemo, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import {
  DashboardCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MasterDataSheetKey, PreviewRow } from "@/features/admin-master-data/api/master-data.types";
import { useMasterDataImportStore, type PreviewFilter } from "@/features/admin-master-data/store/master-data-import.store";

import { MasterDataImportRowEditDialog } from "./master-data-import-row-edit-dialog";

export function MasterDataImportPreviewPanel({
  onBack,
  onConfirm,
  isConfirming,
  isBlocked,
}: {
  onBack: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  // True while a commit is actively running — the progress overlay (a sibling, rendered by
  // the wizard on top of this panel) stays interactive; everything in here does not.
  isBlocked: boolean;
}) {
  const preview = useMasterDataImportStore((state) => state.preview);
  const fileName = useMasterDataImportStore((state) => state.fileName);
  const activeSheetKey = useMasterDataImportStore((state) => state.activeSheetKey);
  const setActiveSheet = useMasterDataImportStore((state) => state.setActiveSheet);
  const filter = useMasterDataImportStore((state) => state.filter);
  const setFilter = useMasterDataImportStore((state) => state.setFilter);
  const searchQuery = useMasterDataImportStore((state) => state.searchQuery);
  const setSearchQuery = useMasterDataImportStore((state) => state.setSearchQuery);
  const editRow = useMasterDataImportStore((state) => state.editRow);
  const removeRow = useMasterDataImportStore((state) => state.removeRow);
  const removeRows = useMasterDataImportStore((state) => state.removeRows);
  const restoreRow = useMasterDataImportStore((state) => state.restoreRow);
  const getEffectiveRows = useMasterDataImportStore((state) => state.getEffectiveRows);
  const getSheetCounts = useMasterDataImportStore((state) => state.getSheetCounts);
  const getOverallCounts = useMasterDataImportStore((state) => state.getOverallCounts);
  const removedIds = useMasterDataImportStore((state) => state.removedIds);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingRow, setEditingRow] = useState<PreviewRow | null>(null);

  const activeSheet = preview?.sheets.find((sheet) => sheet.key === activeSheetKey) ?? null;
  // The filter buttons are the only row-level summary now (no separate top summary strip) —
  // their counts are scoped to the active tab, matching exactly what clicking them shows.
  const sheetCounts = activeSheetKey ? getSheetCounts(activeSheetKey) : { total: 0, accepted: 0, rejected: 0, removed: 0 };
  const inScopeTotal = sheetCounts.accepted + sheetCounts.rejected;
  // The bottom action bar imports across every enabled sheet, not just the active tab, so it
  // needs the overall counts rather than the per-tab ones above.
  const overall = getOverallCounts();

  // Only the active tab's rows are ever filtered/rendered — the other sheets' data is never
  // touched on this render (only the active module tab should render).
  const visibleRows = useMemo(() => {
    if (!activeSheetKey) return [];
    const rows = getEffectiveRows(activeSheetKey);
    const query = searchQuery.trim().toLowerCase();

    return rows.filter((row) => {
      // Redundant with getEffectiveRows' own filtering, but referencing removedIds here
      // (rather than only inside the store) is what makes it a real dependency of this
      // memo — restoring/removing a row must recompute this list immediately.
      if (removedIds.has(row.previewId)) return false;
      if (filter === "accepted" && row.status !== "accepted") return false;
      if (filter === "rejected" && row.status !== "rejected") return false;
      if (query && !Object.values(row.values).some((value) => value.toLowerCase().includes(query))) return false;
      return true;
    });
  }, [activeSheetKey, filter, searchQuery, getEffectiveRows, removedIds]);

  const columns = visibleRows[0] ? Object.keys(visibleRows[0].values) : Object.keys(activeSheet?.rows[0]?.values ?? {});

  if (!preview || !activeSheet) return null;

  function toggleSelect(previewId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(previewId)) next.delete(previewId);
      else next.add(previewId);
      return next;
    });
  }

  function handleRemoveSelected() {
    removeRows([...selectedIds]);
    setSelectedIds(new Set());
  }

  function handleEditSave(values: Record<string, string>) {
    if (!editingRow || !activeSheetKey) return;
    editRow(activeSheetKey, editingRow.previewId, values);
  }

  return (
    // A real bounded height (not just a minimum) so the table region below can take
    // `flex-1 min-h-0` and actually fill whatever space is left, instead of guessing a vh
    // value — the offset accounts for the admin shell's own padding above and below this
    // page. `inert` freezes every control in here (tabs, filters, edit/remove, checkboxes,
    // both action buttons) the moment a commit starts, without relying on the overlay's
    // visuals alone to stop interaction.
    <div className="flex h-[calc(100dvh-9rem)] min-h-0 flex-col gap-3" inert={isBlocked}>
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Preview Master Data</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {fileName}
            {preview.ignoredSheetCount > 0 ? (
              <span className="text-muted-foreground/75"> · some workbook sheets aren&apos;t applicable to this company and were ignored</span>
            ) : null}
          </p>
        </div>
        <Button variant="ghost" className="rounded-xl" onClick={onBack}>
          <AppIcon name="arrow-left" className="size-4" />
          Back to Upload
        </Button>
      </div>

      {/* Module tab rail — a single non-wrapping row. Horizontal overflow scrolls; vertical
          overflow is explicitly hidden (not left as the implicit "auto" browsers apply to a
          fixed-height box once any overflow axis is non-visible) so this can never grow the
          up/down-arrow vertical scrollbar a wrapping + capped-height combination produces.
          The divider lives on this non-scrolling wrapper so it always spans the full tab-rail
          width, however few tabs there are; the active tab's own stronger underline (from the
          shared Tabs primitive) draws on top of it, unclipped, because there's no fixed-height
          crop between it and this border. */}
      <div className="shrink-0 border-b border-border">
        <div className="scrollbar-none overflow-x-auto overflow-y-hidden">
          <Tabs value={activeSheetKey ?? undefined} onValueChange={(value) => value && setActiveSheet(value as MasterDataSheetKey)}>
            <TabsList variant="line" className="min-w-full flex-nowrap justify-start gap-1">
              {preview.sheets.map((sheet) => {
                const counts = getSheetCounts(sheet.key);
                if (counts.total === 0) return null;
                return (
                  <TabsTrigger key={sheet.key} value={sheet.key} className="gap-2 whitespace-nowrap">
                    <span>{sheet.label}</span>
                    {counts.rejected > 0 ? (
                      <Badge variant="destructive">{counts.accepted} · {counts.rejected}!</Badge>
                    ) : (
                      <Badge variant="outline">{counts.accepted}</Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Filter buttons double as the only row-level summary now — no separate Total/
          Accepted/Rejected card strip above. */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/40 p-1">
          {(["all", "accepted", "rejected"] as PreviewFilter[]).map((option) => {
            const count = option === "all" ? inScopeTotal : option === "accepted" ? sheetCounts.accepted : sheetCounts.rejected;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  filter === option ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option} {count}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 ? (
            <Button variant="destructive" size="sm" className="rounded-lg" onClick={handleRemoveSelected}>
              Remove {selectedIds.size} selected
            </Button>
          ) : null}
          <Input
            placeholder="Search this sheet..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 w-56 rounded-lg"
          />
        </div>
      </div>

      {/* Table region fills whatever vertical space is left (flex-1, with min-h-0 so it can
          actually shrink instead of forcing the shell taller) rather than a guessed vh value.
          When there are no visible rows, the wide table isn't rendered at all, so there's
          nothing to horizontally scroll and no scrollbar to show for the empty state. */}
      <DashboardCard className="min-h-0 flex-1 overflow-hidden p-0">
        <div className="h-full overflow-auto">
          {visibleRows.length ? (
            <Table className="[&_td]:py-2.5">
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={visibleRows.every((row) => selectedIds.has(row.previewId))}
                      onCheckedChange={() =>
                        setSelectedIds((current) => {
                          const allSelected = visibleRows.every((row) => current.has(row.previewId));
                          if (allSelected) return new Set();
                          return new Set(visibleRows.map((row) => row.previewId));
                        })
                      }
                      aria-label="Select all visible rows"
                    />
                  </TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow key={row.previewId}>
                    <TableCell>
                      <Checkbox checked={selectedIds.has(row.previewId)} onCheckedChange={() => toggleSelect(row.previewId)} aria-label={`Select row ${row.originalRowNumber}`} />
                    </TableCell>
                    <TableCell>
                      <RowStatusIndicator row={row} />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column} className="max-w-56 truncate text-muted-foreground">
                        {row.values[column] || "—"}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => setEditingRow(row)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg text-destructive hover:text-destructive" onClick={() => removeRow(row.previewId)}>
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
              {filter === "accepted" ? "No accepted rows." : filter === "rejected" ? "No rejected rows." : "No rows match this filter."}
            </div>
          )}
        </div>
      </DashboardCard>

      {removedIds.size > 0 ? (
        <RemovedRowsBar
          count={removedIds.size}
          onRestoreAll={() => removedIds.forEach((id) => restoreRow(id))}
        />
      ) : null}

      {/* Last child of a bounded flex column, not `position: sticky` against a scrolling
          ancestor — the table above owns the only scroll region on this page, so this bar
          never needs to fight it for the bottom edge. */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-1 py-3">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{overall.accepted} rows ready</span>
          {overall.rejected ? ` · ${overall.rejected} need attention` : ""}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl" onClick={onBack} disabled={isConfirming}>
            Back
          </Button>
          <Button className="rounded-xl" onClick={onConfirm} disabled={isConfirming || overall.accepted === 0}>
            {isConfirming
              ? "Starting Import..."
              : overall.rejected > 0
                ? `Import ${overall.accepted} Valid Row${overall.accepted === 1 ? "" : "s"}`
                : `Import ${overall.accepted} Row${overall.accepted === 1 ? "" : "s"}`}
          </Button>
        </div>
      </div>

      <MasterDataImportRowEditDialog row={editingRow} open={Boolean(editingRow)} onOpenChange={(open) => !open && setEditingRow(null)} onSave={handleEditSave} />
    </div>
  );
}

function RowStatusIndicator({ row }: { row: PreviewRow }) {
  if (row.status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
        <Check className="size-3.5" />
        Accepted
      </span>
    );
  }

  const primaryError = row.errors[0];
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive" title={row.errors.map((error) => error.message).join(" ")}>
      <AppIcon name="warning" className="size-3.5" />
      {primaryError?.message ?? "Rejected"}
    </span>
  );
}

function RemovedRowsBar({ count, onRestoreAll }: { count: number; onRestoreAll: () => void }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
      <span>
        {count} row{count === 1 ? "" : "s"} removed from this import.
      </span>
      <Button variant="ghost" size="sm" className="rounded-lg" onClick={onRestoreAll}>
        Undo all
      </Button>
    </div>
  );
}
