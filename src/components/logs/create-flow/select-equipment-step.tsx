"use client";

import { useMemo, useState } from "react";

import { CriticalityBadge } from "@/components/admin/equipment/equipment-badges";
import { AppIcon } from "@/components/common/app-icon";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
} from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEquipmentList } from "@/features/admin-equipment/api/equipment.queries";
import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";
import { cn } from "@/lib/utils";

type SelectEquipmentStepProps = {
  selected: EquipmentListItem | null;
  onSelect: (item: EquipmentListItem) => void;
  onContinue: () => void;
  continueLabel?: string;
};

export function SelectEquipmentStep({
  selected,
  onSelect,
  onContinue,
  continueLabel = "Continue to Recording",
}: SelectEquipmentStepProps) {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useEquipmentList({ limit: 100 });
  const equipment = useMemo(() => data?.data ?? [], [data?.data]);
  const filteredEquipment = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) return equipment;

    return equipment.filter((item) =>
      [item.name, item.equipmentCode, item.section, item.subLocation]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [equipment, search]);

  return (
    <DashboardCard>
      <CardHeader className="border-b border-border/70 px-4 py-3 sm:px-5">
        <CardTitle>Identify Equipment</CardTitle>

      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-36 pt-4 sm:px-5">
        <div className="relative">
          <AppIcon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search EQP-111, pump, utility area..."
            className="h-11 rounded-xl bg-secondary/70 pl-9"
          />
        </div>

        {isLoading ? <p className="text-sm text-muted-foreground">Loading equipment...</p> : null}
        {isError ? (
          <p className="text-sm text-muted-foreground">Could not load equipment.</p>
        ) : null}
        {!isLoading && !isError ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {filteredEquipment.length ? (
              filteredEquipment.map((item) => {
                const isSelected = selected?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={cn(
                      "group flex items-start gap-3 rounded-xl border p-3 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/6 shadow-sm"
                        : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm",
                    )}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <AppIcon name="equipment" className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{item.equipmentCode}</p>
                          <p className="mt-1 truncate text-sm text-foreground">{item.name}</p>
                        </div>
                        <CriticalityBadge criticality={item.criticality} />
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {item.section} / {item.subLocation}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
                No equipment matched your search.
              </p>
            )}
          </div>
        ) : null}

        {selected ? (
          <div className="rounded-xl border border-primary/25 bg-primary/10 p-3">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/14 text-primary">
                <AppIcon name="status" className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Selected Equipment
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <Detail label="Equipment ID" value={selected.equipmentCode} />
                  <Detail label="Equipment Name" value={selected.name} />
                  <Detail label="Section" value={selected.section} />
                  <Detail label="Sub Location" value={selected.subLocation} />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-end border-t border-border bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:left-(--sidebar-width) lg:px-8">
          <Button
            type="button"
            className="w-full rounded-xl sm:w-auto"
            disabled={!selected}
            onClick={onContinue}
          >
            {continueLabel}
            <AppIcon name="caret-right" className="size-4" />
          </Button>
        </div>
      </CardContent>
    </DashboardCard>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-medium text-foreground">{value}</p>
    </div>
  );
}
