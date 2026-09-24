export const assignmentKeys = {
  all: ["assignments"] as const,
  list: () => [...assignmentKeys.all, "list"] as const,
  executors: () => [...assignmentKeys.all, "executors"] as const,
};
