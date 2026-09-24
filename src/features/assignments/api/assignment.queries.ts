import { useQuery } from "@tanstack/react-query";

import { assignmentKeys } from "@/features/assignments/api/assignment.keys";
import type { AssignmentExecutor, ScheduledAssignment } from "@/features/assignments/api/assignment.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { listQueryOptions, referenceQueryOptions } from "@/lib/api/query-options";

export function useAssignments() {
  return useQuery({
    queryKey: assignmentKeys.list(),
    queryFn: () => apiRequest<ScheduledAssignment[]>(apiEndpoints.assignments.root),
    ...listQueryOptions,
  });
}

export function useAssignmentExecutors() {
  return useQuery({
    queryKey: assignmentKeys.executors(),
    queryFn: () => apiRequest<AssignmentExecutor[]>(apiEndpoints.assignments.executors),
    ...referenceQueryOptions,
  });
}
