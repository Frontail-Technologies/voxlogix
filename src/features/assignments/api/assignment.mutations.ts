import { useMutation, useQueryClient } from "@tanstack/react-query";

import { assignmentKeys } from "@/features/assignments/api/assignment.keys";
import type { AssignmentMutationResult, AssignmentPayload, ScheduledAssignment } from "@/features/assignments/api/assignment.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignmentPayload) => apiRequest<ScheduledAssignment>(apiEndpoints.assignments.root, { method: "POST", body: payload }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, payload }: { assignmentId: string; payload: AssignmentPayload }) => apiRequest<AssignmentMutationResult>(apiEndpoints.assignments.byId(assignmentId), { method: "PATCH", body: payload }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
  });
}

export function useCancelAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: string) => apiRequest<AssignmentMutationResult>(apiEndpoints.assignments.cancel(assignmentId), { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
  });
}
