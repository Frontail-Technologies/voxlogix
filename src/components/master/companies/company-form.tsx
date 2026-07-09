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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type CompanyFormValues = {
  companyName?: string;
  logo?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  businessType?: string;
  address?: string;
  planType?: string;
  status?: string;
  startDate?: string;
  expiryDate?: string;
  notes?: string;
};

type CompanyFormProps = {
  mode: "create" | "edit";
  values?: CompanyFormValues;
};

const businessTypes = [
  "Manufacturing",
  "Maintenance Services",
  "Plant Operations",
  "Industrial Services",
  "Factory Operations",
];

const plans = ["Demo", "Business", "Professional", "Enterprise"];
const statuses = ["Active", "Demo", "Inactive", "Suspended"];

export function CompanyForm({ mode, values }: CompanyFormProps) {
  const isEdit = mode === "edit";

  return (
    <DashboardCard>
      <CardContent className="p-4 sm:p-6">
        <form className="space-y-8 pb-32 lg:pb-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Label>Company Logo</Label>
              <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-border bg-secondary/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="size-14 rounded-xl border border-border">
                    <AvatarFallback className="rounded-xl bg-primary/12 text-primary">
                      {values?.logo ?? "VX"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {values?.companyName ?? "Company logo placeholder"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upload is not connected yet. This keeps the UI ready for
                      the later flow.
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" className="rounded-xl">
                  Change Logo
                </Button>
              </div>
            </div>

            <Field label="Company Name">
              <Input
                defaultValue={values?.companyName}
                placeholder="Enter company name"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Business Type">
              <Select defaultValue={values?.businessType ?? "Manufacturing"}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Owner Name">
              <Input
                defaultValue={values?.ownerName}
                placeholder="Enter owner name"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Owner Email">
              <Input
                defaultValue={values?.ownerEmail}
                placeholder="owner@company.com"
                type="email"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Owner Phone">
              <Input
                defaultValue={values?.ownerPhone}
                placeholder="+91 98765 43210"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Plan Type">
              <Select defaultValue={values?.planType ?? "Professional"}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan} value={plan}>
                      {plan}
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
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Start Date">
              <Input
                defaultValue={values?.startDate}
                placeholder="01 Jan 2026"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Expiry Date">
              <Input
                defaultValue={values?.expiryDate}
                placeholder="31 Dec 2026"
                className="h-11 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Address" className="lg:col-span-2">
              <Textarea
                defaultValue={values?.address}
                placeholder="Enter company address"
                className="min-h-24 rounded-xl bg-secondary/70"
              />
            </Field>

            <Field label="Notes" className="lg:col-span-2">
              <Textarea
                defaultValue={values?.notes}
                placeholder="Internal notes for the Master team"
                className="min-h-24 rounded-xl bg-secondary/70"
              />
            </Field>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:justify-end lg:static lg:mx-0 lg:mb-0 lg:border-t lg:bg-transparent lg:p-0 lg:pt-6 lg:shadow-none lg:backdrop-blur-none">
            <Link
              href="/master/companies"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 flex-1 rounded-xl lg:h-8 lg:flex-none",
              )}
            >
              Cancel
            </Link>
            <Button type="button" className="h-11 flex-1 rounded-xl lg:h-8 lg:flex-none">
              <AppIcon name={isEdit ? "settings" : "plus"} className="size-4" />
              {isEdit ? "Update Company" : "Create Company"}
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
