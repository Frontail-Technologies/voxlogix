"use client";

import Link from "next/link";
import { useState } from "react";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import {
  DashboardCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { equipmentSchemaFields } from "@/data/mock-master";
import { cn } from "@/lib/utils";

type ModuleFormProps = {
  mode: "create" | "edit";
};

const draftField = {
  label: "",
  key: "",
  type: "Text",
  required: false,
  aiExtract: true,
  order: equipmentSchemaFields.length + 1,
};

const moduleIconOptions: { label: string; value: AppIconName }[] = [
  { label: "Equipment", value: "equipment" },
  { label: "Safety", value: "warning" },
  { label: "Measurement", value: "status" },
  { label: "Database", value: "database" },
  { label: "Calendar", value: "calendar" },
  { label: "Planning", value: "planning" },
  { label: "AI", value: "ai" },
  { label: "Package", value: "package" },
  { label: "Activity", value: "activity" },
  { label: "Voice", value: "voice" },
];

export function ModuleForm({ mode }: ModuleFormProps) {
  const isEdit = mode === "edit";
  const [selectedIcon, setSelectedIcon] = useState<AppIconName>(
    isEdit ? "equipment" : "modules",
  );

  return (
    <div className="space-y-4 pb-32 sm:space-y-6 lg:pb-0">
      <DashboardCard>
        <CardContent className="grid gap-4 p-4 sm:p-6 xl:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="module-name">Module Name</Label>
            <Input
              id="module-name"
              defaultValue={isEdit ? "Equipment Log" : undefined}
              placeholder="Equipment Log"
              className="h-11 rounded-xl bg-secondary/70"
            />
          </div>
          <div className="space-y-2">
            <Label>Module Type</Label>
            <Select defaultValue="Operational">
              <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operational">Operational</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Measurement">Measurement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select defaultValue={isEdit ? "Active" : "Inactive"}>
              <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="module-color">Module Color</Label>
            <div className="flex h-11 items-center gap-3 rounded-xl border border-input bg-secondary/70 px-3">
              <Input
                id="module-color"
                type="color"
                defaultValue="#f7b51e"
                className="size-7 rounded-md border-0 bg-transparent p-0"
              />
              <Input
                aria-label="Module color hex value"
                defaultValue="#f7b51e"
                className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="space-y-2 xl:col-span-2">
            <Label>Module Icon</Label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
              {moduleIconOptions.map((option) => {
                const active = selectedIcon === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedIcon(option.value)}
                    className={cn(
                      "flex h-11 items-center gap-2 rounded-xl border border-border bg-secondary/70 px-2.5 text-left text-sm transition-colors hover:border-primary/50 hover:bg-primary/8",
                      active &&
                        "border-primary bg-primary/12 text-primary shadow-sm",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground",
                        active && "bg-primary text-primary-foreground",
                      )}
                    >
                      <AppIcon name={option.value} className="size-4" />
                    </span>
                    <span className="min-w-0 truncate font-medium">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="moduleIcon" value={selectedIcon} />
          </div>
          <div className="space-y-2 xl:col-span-2">
            <Label htmlFor="module-description">Description</Label>
            <Textarea
              id="module-description"
              defaultValue={
                isEdit
                  ? "Equipment issue capture module with voice-to-log extraction."
                  : undefined
              }
              placeholder="Describe the module purpose..."
              className="min-h-24 rounded-xl bg-secondary/70"
            />
          </div>
        </CardContent>
      </DashboardCard>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <ModuleFieldsBuilder showDraftRow={!isEdit} />
        <ModulePromptPreview />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:justify-end lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
        <Link
          href="/master/modules"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 flex-1 rounded-xl lg:h-8 lg:flex-none",
          )}
        >
          Cancel
        </Link>
        <Button className="h-11 flex-1 rounded-xl lg:h-8 lg:flex-none">
          <AppIcon name={isEdit ? "settings" : "plus"} className="size-4" />
          {isEdit ? "Update Module" : "Create Module"}
        </Button>
      </div>
    </div>
  );
}

export function ModuleFieldsBuilder({
  showDraftRow = true,
}: {
  showDraftRow?: boolean;
}) {
  const fields = showDraftRow
    ? [...equipmentSchemaFields.slice(0, 3), draftField]
    : equipmentSchemaFields;

  return (
    <DashboardCard>
      <CardHeader className="border-b border-border px-5 py-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Schema Fields</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add the fields this module will capture and optionally extract by
              AI.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl">
            <AppIcon name="plus" className="size-4" />
            Add Field
          </Button>
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field Label</TableHead>
            <TableHead>Field Key</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>AI Extract</TableHead>
            <TableHead>Order</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.key || "new-field"}>
              <TableCell>
                {field.key ? (
                  <span className="font-medium">{field.label}</span>
                ) : (
                  <Input
                    placeholder="New field label"
                    className="h-9 min-w-40 rounded-lg bg-secondary/70"
                  />
                )}
              </TableCell>
              <TableCell>
                {field.key ? (
                  field.key
                ) : (
                  <Input
                    placeholder="field_key"
                    className="h-9 min-w-36 rounded-lg bg-secondary/70"
                  />
                )}
              </TableCell>
              <TableCell>
                {field.key ? (
                  field.type
                ) : (
                  <Select defaultValue="Text">
                    <SelectTrigger className="h-9 w-32 rounded-lg bg-secondary/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Text">Text</SelectItem>
                      <SelectItem value="Number">Number</SelectItem>
                      <SelectItem value="Select">Select</SelectItem>
                      <SelectItem value="Date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>
                <Switch defaultChecked={field.required} />
              </TableCell>
              <TableCell>
                <Switch defaultChecked={field.aiExtract} />
              </TableCell>
              <TableCell>{field.order || index + 1}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardCard>
  );
}

export function ModulePromptPreview() {
  return (
    <DashboardCard>
      <CardHeader className="border-b border-border px-5 py-2">
        <CardTitle>AI Prompt Preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          AI will extract only the enabled fields from this schema.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <pre className="overflow-auto rounded-2xl border border-border bg-background p-4 text-xs leading-6 text-muted-foreground">
{`{
  "equipment_id": "EQ-1031",
  "equipment_name": "Air Compressor",
  "section": "Utilities",
  "sub_location": "Boiler Room",
  "issue_category": "Leakage"
}`}
        </pre>
      </CardContent>
    </DashboardCard>
  );
}
