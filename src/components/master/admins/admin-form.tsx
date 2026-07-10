import Link from "next/link";
import type { ReactNode } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { companies } from "@/data/mock-master";
import { cn } from "@/lib/utils";

export type AdminFormValues = {
  fullName?: string;
  initials?: string;
  username?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
};

type AdminFormProps = {
  mode: "create" | "edit";
  values?: AdminFormValues;
};

export function AdminForm({ mode, values }: AdminFormProps) {
  const isEdit = mode === "edit";

  return (
    <DashboardCard>
      <CardContent className="p-4 sm:p-6">
        <form className="space-y-8 pb-32 lg:pb-0">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 rounded-full border border-primary/20 bg-primary/12">
                <AvatarFallback className="font-semibold text-primary">
                  {values?.initials ?? "AD"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {values?.fullName ?? "Admin profile preview"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Avatar uses initials until profile image upload is added.
                </p>
              </div>
            </div>
            <Button type="button" variant="outline" className="rounded-xl">
              Change Avatar
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Full Name">
              <Input
                defaultValue={values?.fullName}
                placeholder="Enter full name"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Username">
              <Input
                defaultValue={values?.username}
                placeholder="john.doe"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Email">
              <Input
                defaultValue={values?.email}
                placeholder="admin@company.com"
                type="email"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Phone">
              <Input
                defaultValue={values?.phone}
                placeholder="+91 98765 43210"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Company">
              <Select defaultValue={values?.company ?? companies[0].company}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.company} value={company.company}>
                      {company.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Status">
              <Select defaultValue={values?.status ?? "Active"}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {!isEdit ? (
              <>
                <Field label="Temporary Password">
                  <Input
                    placeholder="Set temporary password"
                    type="password"
                    className="h-11 rounded-xl bg-secondary/70"
                  />
                </Field>
                <Field label="Confirm Password">
                  <Input
                    placeholder="Confirm temporary password"
                    type="password"
                    className="h-11 rounded-xl bg-secondary/70"
                  />
                </Field>
              </>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ToggleCard
              title="Send Welcome Email"
              description="Mock notification for the assigned company admin."
              control={<Switch defaultChecked={!isEdit} />}
            />
            <ToggleCard
              title={isEdit ? "Require Password Reset" : "Force First Login Reset"}
              description="User will change password on the next sign-in."
              control={<Switch defaultChecked={isEdit} />}
            />
          </div>

          <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:justify-end lg:static lg:mx-0 lg:mb-0 lg:border-t lg:bg-transparent lg:p-0 lg:pt-6 lg:shadow-none lg:backdrop-blur-none">
            <Link
              href="/master/admins"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 flex-1 rounded-xl lg:h-8 lg:flex-none",
              )}
            >
              Cancel
            </Link>
            <Button type="button" className="h-11 flex-1 rounded-xl lg:h-8 lg:flex-none">
              <AppIcon name={isEdit ? "settings" : "plus"} className="size-4" />
              {isEdit ? "Update Admin" : "Create Admin"}
            </Button>
          </div>
        </form>
      </CardContent>
    </DashboardCard>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ToggleCard({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/70 p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      {control}
    </div>
  );
}
