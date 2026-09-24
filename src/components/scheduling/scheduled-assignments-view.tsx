"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { DatePickerField } from "@/components/common/date-picker-field";
import { DashboardCard, DashboardPageHeader, StatusBadge } from "@/components/common/dashboard-ui";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCancelAssignment, useCreateAssignment, useUpdateAssignment } from "@/features/assignments/api/assignment.mutations";
import { useAssignmentExecutors, useAssignments } from "@/features/assignments/api/assignment.queries";
import type { AssignmentExecutor, AssignmentPayload, ScheduledAssignment } from "@/features/assignments/api/assignment.types";
import { showApiErrorToast } from "@/lib/api/error-toast";

export function ScheduledAssignmentsView() {
  const assignmentsQuery = useAssignments();
  const cancelMutation = useCancelAssignment();
  const assignments = assignmentsQuery.data?.data ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduledAssignment | null>(null);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(assignment: ScheduledAssignment) {
    setEditing(assignment);
    setDialogOpen(true);
  }

  async function cancel(assignment: ScheduledAssignment) {
    try {
      await cancelMutation.mutateAsync(assignment.id);
      toast.success("Schedule cancelled");
    } catch (error) {
      showApiErrorToast(error, "Could not cancel schedule");
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Schedule Work"
        description="Assign dated work to active Executors."
        action={<Button onClick={openCreate}><AppIcon name="plus" className="size-4" />Schedule Work</Button>}
      />

      {assignmentsQuery.isPending ? <AssignmentSkeletons /> : assignmentsQuery.isError ? (
        <DashboardCard><CardContent className="flex items-center justify-between gap-3 p-5"><p className="text-sm text-muted-foreground">Could not load scheduled work.</p><Button variant="outline" onClick={() => assignmentsQuery.refetch()}>Retry</Button></CardContent></DashboardCard>
      ) : assignments.length === 0 ? (
        <DashboardCard><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary"><AppIcon name="calendar" className="size-5" /></span><p className="font-medium">No work scheduled</p><Button size="sm" onClick={openCreate}><AppIcon name="plus" className="size-4" />Schedule Work</Button></CardContent></DashboardCard>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {assignments.map((assignment) => (
            <DashboardCard key={assignment.id}>
              <CardContent className="space-y-4 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="truncate font-semibold text-foreground">{assignment.title}</p><p className="mt-1 text-sm text-muted-foreground">{formatSchedule(assignment.scheduledAt)}</p></div>
                  <StatusBadge status={assignment.status} />
                </div>
                <div className="flex items-center gap-2 text-sm"><span className="flex size-8 items-center justify-center rounded-full bg-secondary font-semibold">{initials(assignment.assignedTo.fullName)}</span><span className="min-w-0 truncate">{assignment.assignedTo.fullName}</span></div>
                {assignment.description ? <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">{assignment.description}</p> : null}
                {assignment.status === "SCHEDULED" ? (
                  <div className="flex gap-2 border-t border-border pt-3">
                    <Button variant="outline" size="sm" onClick={() => openEdit(assignment)}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="outline" size="sm" className="text-destructive" />}>Cancel</AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Cancel scheduled work?</AlertDialogTitle><AlertDialogDescription>The assigned Executor will receive an in-app cancellation notification.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Keep schedule</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => void cancel(assignment)}>Cancel schedule</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : null}
              </CardContent>
            </DashboardCard>
          ))}
        </div>
      )}

      <AssignmentDialog assignment={editing} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function AssignmentDialog({ assignment, open, onOpenChange }: { assignment: ScheduledAssignment | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>{assignment ? "Edit scheduled work" : "Schedule Work"}</DialogTitle><DialogDescription>Choose an active Executor and schedule.</DialogDescription></DialogHeader>
        {open ? <AssignmentForm assignment={assignment} onComplete={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function AssignmentForm({ assignment, onComplete }: { assignment: ScheduledAssignment | null; onComplete: () => void }) {
  const executorsQuery = useAssignmentExecutors();
  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();
  const initialSchedule = scheduleParts(assignment?.scheduledAt);
  const [executorId, setExecutorId] = useState(assignment?.assignedToUserId ?? "");
  const [executorSearch, setExecutorSearch] = useState(assignment?.assignedTo.fullName ?? "");
  const [title, setTitle] = useState(assignment?.title ?? "");
  const [date, setDate] = useState(initialSchedule.date);
  const [time, setTime] = useState(initialSchedule.time);
  const [description, setDescription] = useState(assignment?.description ?? "");
  const executors = useMemo(() => executorsQuery.data?.data ?? [], [executorsQuery.data?.data]);
  const filteredExecutors = useMemo(() => {
    const search = executorSearch.trim().toLowerCase();
    if (!search || executors.some((executor) => executor.id === executorId && executor.fullName.toLowerCase() === search)) return executors;
    return executors.filter((executor) => `${executor.fullName} ${executor.email}`.toLowerCase().includes(search));
  }, [executorId, executorSearch, executors]);
  const pending = createMutation.isPending || updateMutation.isPending;

  function selectExecutor(executor: AssignmentExecutor) {
    setExecutorId(executor.id);
    setExecutorSearch(executor.fullName);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!executorId) return toast.error("Select an Executor.");
    if (!title.trim() || !date || !time) return toast.error("Enter a title, date, and time.");
    const scheduledAt = new Date(`${date}T${time}`);
    if (Number.isNaN(scheduledAt.getTime())) return toast.error("Enter a valid schedule.");
    const payload: AssignmentPayload = { assignedToUserId: executorId, title: title.trim(), description: description.trim() || null, scheduledAt: scheduledAt.toISOString() };
    try {
      if (assignment) await updateMutation.mutateAsync({ assignmentId: assignment.id, payload });
      else await createMutation.mutateAsync(payload);
      toast.success(assignment ? "Schedule updated" : "Work scheduled");
      onComplete();
    } catch (error) {
      showApiErrorToast(error, assignment ? "Could not update schedule" : "Could not schedule work");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="executor-search">Executor</Label>
        <Input id="executor-search" value={executorSearch} onChange={(event) => { setExecutorSearch(event.target.value); setExecutorId(""); }} placeholder="Search by name or email" autoComplete="off" />
        {!executorId ? <div className="max-h-36 overflow-y-auto rounded-lg border border-border p-1">
          {executorsQuery.isPending ? <p className="p-2 text-sm text-muted-foreground">Loading Executors...</p> : filteredExecutors.length ? filteredExecutors.map((executor) => (
            <button key={executor.id} type="button" onClick={() => selectExecutor(executor)} className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left hover:bg-secondary"><span className="truncate text-sm font-medium">{executor.fullName}</span><span className="truncate text-xs text-muted-foreground">{executor.email}</span></button>
          )) : <p className="p-2 text-sm text-muted-foreground">No active Executors found.</p>}
        </div> : null}
      </div>
      <div className="space-y-2"><Label htmlFor="assignment-title">Title</Label><Input id="assignment-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={180} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Date</Label><DatePickerField value={date} onChange={setDate} /></div>
        <div className="space-y-2"><Label htmlFor="assignment-time">Time</Label><Input id="assignment-time" type="time" className="h-11" value={time} onChange={(event) => setTime(event.target.value)} /></div>
      </div>
      <div className="space-y-2"><Label htmlFor="assignment-instructions">Instructions <span className="font-normal text-muted-foreground">(optional)</span></Label><Textarea id="assignment-instructions" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} rows={4} /></div>
      <DialogFooter><Button type="submit" disabled={pending || executorsQuery.isPending}><AppIcon name="calendar" className="size-4" />{pending ? "Saving..." : assignment ? "Save changes" : "Schedule"}</Button></DialogFooter>
    </form>
  );
}

function AssignmentSkeletons() {
  return <div className="grid gap-3 lg:grid-cols-2">{[0, 1, 2, 3].map((item) => <DashboardCard key={item}><CardContent className="space-y-4 p-5"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-8 w-1/3" /></CardContent></DashboardCard>)}</div>;
}

function scheduleParts(value?: string) {
  const date = value ? new Date(value) : new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString();
  return { date: local.slice(0, 10), time: value ? local.slice(11, 16) : "09:00" };
}

function formatSchedule(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
