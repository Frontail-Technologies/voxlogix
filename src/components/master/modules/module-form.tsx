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
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { equipmentSchemaFields } from "@/data/mock-master";

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

export function ModuleForm({ mode }: ModuleFormProps) {
  const isEdit = mode === "edit";

  return (
    <div className="space-y-6">
      <DashboardCard>
        <CardHeader className="border-b border-border px-6 py-5">
          <CardTitle>{isEdit ? "Module Details" : "New Module Details"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define the module identity, status, and display metadata.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 p-6 xl:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="module-name">Module Name</Label>
            <Input
              id="module-name"
              defaultValue={isEdit ? "Equipment Log" : undefined}
              placeholder="Equipment Log"
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label>Module Type</Label>
            <Select defaultValue="Operational">
              <SelectTrigger className="h-11 w-full rounded-xl bg-background">
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
              <SelectTrigger className="h-11 w-full rounded-xl bg-background">
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
            <div className="flex h-11 items-center gap-3 rounded-xl border border-input bg-background px-3">
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
            <Label htmlFor="module-description">Description</Label>
            <Textarea
              id="module-description"
              defaultValue={
                isEdit
                  ? "Equipment issue capture module with voice-to-log extraction."
                  : undefined
              }
              placeholder="Describe the module purpose..."
              className="min-h-24 rounded-xl bg-background"
            />
          </div>
        </CardContent>
      </DashboardCard>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <ModuleFieldsBuilder showDraftRow={!isEdit} />
        <ModulePromptPreview />
      </div>

      <div className="flex justify-end">
        <Button className="rounded-xl">
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
      <CardHeader className="border-b border-border px-5 py-4">
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
                    className="h-9 min-w-40 rounded-lg bg-background"
                  />
                )}
              </TableCell>
              <TableCell>
                {field.key ? (
                  field.key
                ) : (
                  <Input
                    placeholder="field_key"
                    className="h-9 min-w-36 rounded-lg bg-background"
                  />
                )}
              </TableCell>
              <TableCell>
                {field.key ? (
                  field.type
                ) : (
                  <Select defaultValue="Text">
                    <SelectTrigger className="h-9 w-32 rounded-lg bg-background">
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
                <Checkbox defaultChecked={field.required} />
              </TableCell>
              <TableCell>
                <Checkbox defaultChecked={field.aiExtract} />
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
      <CardHeader className="border-b border-border px-5 py-4">
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
