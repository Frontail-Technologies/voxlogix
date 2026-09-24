"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSendAdminNotification } from "@/features/notifications/api/notification.mutations";
import { useAdminsList } from "@/features/master-admins/api/admin.queries";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

export function AdminNotificationsView() {
  const executorsQuery = useAdminsList({ role: "EXECUTION", status: "ACTIVE", page: 1, limit: 100 });
  const sendMutation = useSendAdminNotification();
  const executors = executorsQuery.data?.data ?? [];
  const [audience, setAudience] = useState<"SELECTED" | "ALL">("SELECTED");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function toggleRecipient(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !message.trim()) return toast.error("Enter a title and message.");
    if (audience === "SELECTED" && selectedIds.size === 0) return toast.error("Select at least one Executor.");
    try {
      const response = await sendMutation.mutateAsync({
        audience,
        recipientUserIds: audience === "SELECTED" ? Array.from(selectedIds) : undefined,
        title: title.trim(),
        message: message.trim(),
      });
      const sent = response.data?.sent ?? 0;
      toast.success(`Notification sent to ${sent} Executor${sent === 1 ? "" : "s"}.`);
      setTitle("");
      setMessage("");
      setSelectedIds(new Set());
    } catch (error) {
      showApiErrorToast(error, "Could not send notification");
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Notifications" description="Send in-app updates to active Executors in your company." />
      <form onSubmit={handleSubmit}>
        <DashboardCard className="max-w-3xl">
          <CardHeader className="border-b border-border px-4 py-4 sm:px-5">
            <CardTitle className="flex items-center gap-2 text-base"><AppIcon name="notifications" className="size-5 text-primary" />New notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-2">
              {(["SELECTED", "ALL"] as const).map((value) => (
                <button key={value} type="button" onClick={() => setAudience(value)} className={cn("h-10 rounded-lg border px-3 text-sm font-medium", audience === value ? "border-primary bg-primary/12 text-foreground" : "border-border bg-background text-muted-foreground")}>
                  {value === "SELECTED" ? "Selected Executors" : "All Executors"}
                </button>
              ))}
            </div>

            {audience === "SELECTED" ? (
              <div className="space-y-2">
                <Label>Recipients</Label>
                <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
                  {executorsQuery.isLoading ? <p className="p-2 text-sm text-muted-foreground">Loading Executors...</p> : executors.length ? executors.map((executor) => (
                    <label key={executor.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-secondary/60">
                      <Checkbox checked={selectedIds.has(executor.id)} onCheckedChange={() => toggleRecipient(executor.id)} />
                      <span className="min-w-0"><span className="block truncate text-sm font-medium">{executor.fullName}</span><span className="block truncate text-xs text-muted-foreground">{executor.email}</span></span>
                    </label>
                  )) : <p className="p-2 text-sm text-muted-foreground">No active Executors found.</p>}
                </div>
              </div>
            ) : null}

            <div className="space-y-2"><Label htmlFor="notification-title">Title</Label><Input id="notification-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={180} /></div>
            <div className="space-y-2"><Label htmlFor="notification-message">Message</Label><Textarea id="notification-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} rows={5} /></div>
            <Button type="submit" className="rounded-xl" disabled={sendMutation.isPending || executorsQuery.isLoading}>
              <AppIcon name="notifications" className="size-4" />{sendMutation.isPending ? "Sending..." : "Send Notification"}
            </Button>
          </CardContent>
        </DashboardCard>
      </form>
    </div>
  );
}
