export const settingsKeys = {
  all: ["master-settings"] as const,
  general: () => [...settingsKeys.all, "general"] as const,
  ai: () => [...settingsKeys.all, "ai"] as const,
};