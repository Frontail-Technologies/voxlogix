"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/api/auth.mutations";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  iconOnly = false,
  variant = "outline",
}: {
  className?: string;
  iconOnly?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
}) {
  const router = useRouter();
  const logoutMutation = useLogout();

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out");
      router.replace("/login");
    } catch (error) {
      showApiErrorToast(error, "Could not log out");
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon-sm" : "default"}
      className={cn(iconOnly ? "rounded-lg" : "rounded-xl", className)}
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      title="Logout"
    >
      <AppIcon name="sign-out" className="size-4" />
      {iconOnly ? <span className="sr-only">Logout</span> : logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
