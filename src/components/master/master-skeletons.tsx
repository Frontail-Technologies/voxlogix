import { DashboardCard, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/dashboard-ui";
import { Skeleton } from "@/components/ui/skeleton";

export function MasterTableSkeleton({ columns, rows = 9 }: { columns: number; rows?: number }) {
  return (
    <Table className="[&_td]:py-3">
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={index}><Skeleton className="h-4 w-24" /></TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <TableCell key={columnIndex}>
                <Skeleton className={columnIndex === 0 ? "h-9 w-full max-w-52" : columnIndex === columns - 1 ? "ml-auto h-8 w-20" : "h-5 w-full max-w-40"} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function MasterToolbarSkeleton({ filters = 2 }: { filters?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Skeleton className="h-10 w-full rounded-xl sm:w-80" />
      {Array.from({ length: filters }).map((_, index) => <Skeleton key={index} className="h-10 w-40 rounded-xl" />)}
    </div>
  );
}

export function ModuleCardGridSkeleton({ cards = 9 }: { cards?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <DashboardCard key={index} className="rounded-xl">
          <div className="flex min-h-[232px] flex-col gap-4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="size-11 shrink-0 rounded-xl" />
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 shrink-0 rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
            </div>
            <Skeleton className="mt-auto h-10 rounded-xl" />
          </div>
        </DashboardCard>
      ))}
    </div>
  );
}

export function LogsCardGridSkeleton({ cards = 5 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <DashboardCard key={index} className="overflow-hidden rounded-xl">
          <Skeleton className="aspect-16/9 w-full rounded-none" />
          <div className="space-y-3 p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-24" /></div>
              <Skeleton className="size-8 shrink-0 rounded-lg" />
            </div>
            <div className="flex items-center gap-1.5"><Skeleton className="h-6 w-24 rounded-full" /><Skeleton className="h-6 w-20 rounded-full" /></div>
            <div className="flex items-center justify-between gap-2"><div className="flex min-w-0 flex-1 items-center gap-2"><Skeleton className="size-6 shrink-0 rounded-full" /><Skeleton className="h-3 w-28" /></div><Skeleton className="h-3 w-16" /></div>
            <Skeleton className="h-3 w-24" />
          </div>
        </DashboardCard>
      ))}
    </div>
  );
}

export function MasterCardGridSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <DashboardCard key={index} className="min-h-[92px] sm:min-h-[106px]">
          <div className="flex h-full flex-col items-start gap-2 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
            <Skeleton className="size-9 shrink-0 rounded-xl sm:size-12" />
            <div className="min-w-0 flex-1 space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-7 w-16" /><Skeleton className="hidden h-4 w-24 sm:block" /></div>
          </div>
        </DashboardCard>
      ))}
    </div>
  );
}

export function MasterDetailSkeleton() {
  return (
    <DashboardCard>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-4"><Skeleton className="size-14 rounded-2xl" /><div className="space-y-2"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-32" /></div></div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)}</div>
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    </DashboardCard>
  );
}

export function MasterFormSkeleton() {
  return (
    <DashboardCard>
      <div className="space-y-6 p-4 sm:p-6">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">{Array.from({ length: 7 }).map((_, index) => <div key={index} className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-11 rounded-xl" /></div>)}</div>
      </div>
    </DashboardCard>
  );
}
