"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/config/constants";
import { useChangePassword } from "@/features/auth/api/auth.mutations";
import { useCurrentUser } from "@/features/auth/api/auth.queries";
import { showApiErrorToast } from "@/lib/api/error-toast";
import {
  blurActiveElement,
  clearFieldError,
  focusFirstError,
  hasFieldErrors,
  type FieldErrors,
} from "@/lib/forms/form-state";

const roleRedirects: Record<string, string> = {
  MASTER: "/master/dashboard",
  ADMIN: "/admin/dashboard",
  PLANNER: "/planner/dashboard",
  EXECUTION: "/execution/dashboard",
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data, isLoading } = useCurrentUser();
  const user = data?.data;
  const changePasswordMutation = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!user.requirePasswordReset) {
      router.replace(roleRedirects[user.role] ?? "/unauthorized");
    }
  }, [isLoading, user, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();

    const nextErrors: FieldErrors = {};
    if (!currentPassword) nextErrors.currentPassword = "Enter your temporary password.";
    if (newPassword.length < 8) nextErrors.newPassword = "Password must be at least 8 characters.";
    if (confirmPassword.length < 8) {
      nextErrors.confirmPassword = "Confirm password must be at least 8 characters.";
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      focusFirstError(event.currentTarget, nextErrors);
      return;
    }

    try {
      const response = await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      toast.success("Password updated successfully.");
      const role = response.data?.role ?? "";
      router.replace(roleRedirects[role] ?? "/unauthorized");
    } catch (error) {
      showApiErrorToast(error, "Could not update password");
    }
  }

  if (isLoading || !user || !user.requirePasswordReset) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary),transparent_72%),transparent_58%)] blur-2xl dark:h-80 dark:bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary),transparent_45%),transparent_60%)]" />
      <Card className="relative w-full max-w-md rounded-3xl border-border bg-card/92 shadow-xl shadow-foreground/5 backdrop-blur">
        <CardHeader className="items-center justify-center pb-3 text-center">
          <div className="relative h-28 w-32 max-w-full">
            <Image
              src="/images/logo-dark.png"
              alt={APP_NAME}
              fill
              priority
              sizes="128px"
              className="object-contain dark:hidden"
            />
            <Image
              src="/images/logo-light.png"
              alt={APP_NAME}
              fill
              priority
              sizes="128px"
              className="hidden object-contain dark:block"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-3">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1 text-center">
              <h1 className="text-lg font-semibold text-foreground">Set a New Password</h1>
              <p className="text-sm text-muted-foreground">
                For your security, you must set a new password before continuing.
              </p>
            </div>
            <FormField label="Temporary password" fieldName="currentPassword" error={errors.currentPassword}>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  setErrors((current) => clearFieldError(current, "currentPassword"));
                }}
                className="h-11 rounded-xl bg-secondary/70"
                aria-invalid={Boolean(errors.currentPassword)}
              />
            </FormField>
            <FormField label="New password" fieldName="newPassword" error={errors.newPassword}>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setErrors((current) => clearFieldError(current, "newPassword"));
                }}
                className="h-11 rounded-xl bg-secondary/70"
                aria-invalid={Boolean(errors.newPassword)}
              />
            </FormField>
            <FormField label="Confirm password" fieldName="confirmPassword" error={errors.confirmPassword}>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setErrors((current) => clearFieldError(current, "confirmPassword"));
                }}
                className="h-11 rounded-xl bg-secondary/70"
                aria-invalid={Boolean(errors.confirmPassword)}
              />
            </FormField>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? "Saving..." : "Set New Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
