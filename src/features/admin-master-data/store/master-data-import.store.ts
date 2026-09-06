import { create } from "zustand";

import type {
  CommitSheetInput,
  MasterDataImportPreview,
  MasterDataImportResult,
  MasterDataSheetKey,
  PreviewRow,
} from "@/features/admin-master-data/api/master-data.types";

export type ImportStep = "upload" | "preview" | "progress" | "success" | "error";
export type PreviewFilter = "all" | "accepted" | "rejected";

// Mirrors the backend's own required-field rules (master-data-import.service.ts) closely
// enough for immediate UX feedback after an edit — this is NOT the source of truth. The
// server re-validates everything (including duplicate/module/reference checks this doesn't
// attempt) at commit time; see Part 6 of the spec this store implements against.
const REQUIRED_FIELDS: Record<MasterDataSheetKey, string[]> = {
  locations: ["SECTION", "LOCATION"],
  equipment: ["EQUIPMENT ID", "EQUIPMENT NAME", "SECTION", "SUB LOCATION"],
  issueCategories: ["ISSUE CATEGORY"],
  safety: ["INCIDENT CATEGORY", "INCIDENT TYPE"],
  measuringPoints: ["POINT ID", "MEASUREMENT NAME"],
  meterCounters: ["COUNTER ID", "COUNTER NAME"],
  users: ["EMPLOYEE ID", "FULL NAME", "EMAIL"],
  kaizen: ["KAIZEN CATEGORY"],
};

function recomputeRowAfterEdit(sheetKey: MasterDataSheetKey, row: PreviewRow, edited: Record<string, string>): PreviewRow {
  const values = { ...row.values, ...edited };
  // Server-context errors (duplicate/module-disabled/unknown-reference) can't be
  // re-evaluated client-side without a round trip — keep them; only required-field errors
  // are recomputed locally, since that's the one thing an edit can fix or break instantly.
  const carriedErrors = row.errors.filter((error) => error.code !== "REQUIRED");
  const requiredErrors = REQUIRED_FIELDS[sheetKey]
    .filter((field) => !values[field]?.trim())
    .map((field) => ({ field, code: "REQUIRED" as const, message: `${field.charAt(0)}${field.slice(1).toLowerCase()} is required.` }));
  const errors = [...carriedErrors, ...requiredErrors];

  return { ...row, values, errors, status: errors.length ? "rejected" : "accepted" };
}

type MasterDataImportState = {
  step: ImportStep;
  fileName: string | null;
  preview: MasterDataImportPreview | null;
  // Row-targeted: editing one row only touches its own entry, never clones the whole
  // preview tree (Part 17 — avoid cloning the entire workbook state for every cell edit).
  editedValues: Record<string, Record<string, string>>;
  removedIds: Set<string>;
  activeSheetKey: MasterDataSheetKey | null;
  filter: PreviewFilter;
  searchQuery: string;
  commitResult: MasterDataImportResult | null;
  commitError: string | null;
  hasUnsavedPreviewChanges: boolean;

  setPreview: (preview: MasterDataImportPreview, fileName: string) => void;
  editRow: (sheetKey: MasterDataSheetKey, previewId: string, values: Record<string, string>) => void;
  removeRow: (previewId: string) => void;
  removeRows: (previewIds: string[]) => void;
  restoreRow: (previewId: string) => void;
  setActiveSheet: (key: MasterDataSheetKey) => void;
  setFilter: (filter: PreviewFilter) => void;
  setSearchQuery: (query: string) => void;
  goToStep: (step: ImportStep) => void;
  setCommitResult: (result: MasterDataImportResult) => void;
  setCommitError: (message: string) => void;
  reset: () => void;

  getEffectiveRows: (sheetKey: MasterDataSheetKey) => PreviewRow[];
  getSheetCounts: (sheetKey: MasterDataSheetKey) => { total: number; accepted: number; rejected: number; removed: number };
  getOverallCounts: () => { total: number; accepted: number; rejected: number; removed: number };
  getCommitPayload: () => CommitSheetInput[];
};

const initialState = {
  step: "upload" as ImportStep,
  fileName: null as string | null,
  preview: null as MasterDataImportPreview | null,
  editedValues: {} as Record<string, Record<string, string>>,
  removedIds: new Set<string>(),
  activeSheetKey: null as MasterDataSheetKey | null,
  filter: "all" as PreviewFilter,
  searchQuery: "",
  commitResult: null as MasterDataImportResult | null,
  commitError: null as string | null,
  hasUnsavedPreviewChanges: false,
};

// Ephemeral, session-only import state — deliberately not persisted to localStorage (this
// is a working draft of someone else's spreadsheet data, not a user preference) and
// deliberately cleared on reset() so one company/session's preview can never leak into the
// next (see reset() call sites: successful commit, explicit cancel, and picking a new file).
export const useMasterDataImportStore = create<MasterDataImportState>((set, get) => ({
  ...initialState,

  setPreview: (preview, fileName) =>
    set({
      preview,
      fileName,
      step: "preview",
      editedValues: {},
      removedIds: new Set(),
      activeSheetKey: preview.sheets.find((sheet) => sheet.rows.length > 0)?.key ?? preview.sheets[0]?.key ?? null,
      filter: "all",
      searchQuery: "",
      hasUnsavedPreviewChanges: false,
    }),

  editRow: (sheetKey, previewId, values) =>
    set((state) => ({
      editedValues: { ...state.editedValues, [previewId]: { ...state.editedValues[previewId], ...values } },
      hasUnsavedPreviewChanges: true,
    })),

  removeRow: (previewId) =>
    set((state) => {
      const next = new Set(state.removedIds);
      next.add(previewId);
      return { removedIds: next, hasUnsavedPreviewChanges: true };
    }),

  removeRows: (previewIds) =>
    set((state) => {
      const next = new Set(state.removedIds);
      previewIds.forEach((id) => next.add(id));
      return { removedIds: next, hasUnsavedPreviewChanges: true };
    }),

  restoreRow: (previewId) =>
    set((state) => {
      const next = new Set(state.removedIds);
      next.delete(previewId);
      return { removedIds: next };
    }),

  setActiveSheet: (key) => set({ activeSheetKey: key }),
  setFilter: (filter) => set({ filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  goToStep: (step) => set({ step }),
  setCommitResult: (result) => set({ commitResult: result, step: "success", hasUnsavedPreviewChanges: false }),
  setCommitError: (message) => set({ commitError: message, step: "error" }),

  // Full reset, including the parsed File/workbook reference — nothing about a finished or
  // abandoned import session should outlive it.
  reset: () => set({ ...initialState, removedIds: new Set() }),

  getEffectiveRows: (sheetKey) => {
    const state = get();
    const sheet = state.preview?.sheets.find((candidate) => candidate.key === sheetKey);
    if (!sheet) return [];

    return sheet.rows
      .filter((row) => !state.removedIds.has(row.previewId))
      .map((row) => {
        const edited = state.editedValues[row.previewId];
        if (!edited || !sheet.moduleEnabled) return row;
        return recomputeRowAfterEdit(sheetKey, row, edited);
      });
  },

  getSheetCounts: (sheetKey) => {
    const state = get();
    const sheet = state.preview?.sheets.find((candidate) => candidate.key === sheetKey);
    if (!sheet) return { total: 0, accepted: 0, rejected: 0, removed: 0 };

    const removed = sheet.rows.filter((row) => state.removedIds.has(row.previewId)).length;
    const effective = get().getEffectiveRows(sheetKey);
    const accepted = effective.filter((row) => row.status === "accepted").length;
    return { total: sheet.rows.length, accepted, rejected: effective.length - accepted, removed };
  },

  getOverallCounts: () => {
    const state = get();
    if (!state.preview) return { total: 0, accepted: 0, rejected: 0, removed: 0 };

    return state.preview.sheets.reduce(
      (totals, sheet) => {
        const counts = get().getSheetCounts(sheet.key);
        return {
          total: totals.total + counts.total,
          accepted: totals.accepted + counts.accepted,
          rejected: totals.rejected + counts.rejected,
          removed: totals.removed + counts.removed,
        };
      },
      { total: 0, accepted: 0, rejected: 0, removed: 0 },
    );
  },

  getCommitPayload: () => {
    const state = get();
    if (!state.preview) return [];

    return state.preview.sheets.map((sheet) => ({
      key: sheet.key,
      // Only accepted, non-removed rows are ever sent for import — matching "do not
      // silently import rejected rows" (Part 9). The server independently re-derives
      // acceptance anyway, but there's no reason to send rows we already know are invalid.
      rows: get()
        .getEffectiveRows(sheet.key)
        .filter((row) => row.status === "accepted")
        .map((row) => ({ previewId: row.previewId, values: row.values })),
    }));
  },
}));
