import { create } from "zustand";

// A tiny, generic "don't let the user navigate away right now" signal — any page can arm it
// while it's mid-flight on something that would be unsafe to abandon (an in-progress import,
// a submitting wizard, etc.), and the sidebar checks it before following a nav link. Kept
// app-wide and feature-agnostic on purpose: this is the one shared piece of navigation
// interception logic, not something each feature should reimplement.
type NavigationGuardState = {
  isBlocked: boolean;
  message: string;
  setGuard: (blocked: boolean, message?: string) => void;
};

export const useNavigationGuardStore = create<NavigationGuardState>((set) => ({
  isBlocked: false,
  message: "",
  setGuard: (blocked, message = "") => set({ isBlocked: blocked, message: blocked ? message : "" }),
}));
