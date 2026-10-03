"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/config/constants";
import { useResetPassword } from "@/features/auth/api/auth.mutations";
import { showApiErrorToast } from "@/lib/api/error-toast";
import {
  blurActiveElement,
  clearFieldError,
  focusFirstError,
  hasFieldErrors,
  type FieldErrors,
} from "@/lib/forms/form-state";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [done, setDone] = useState(false);

  const resetPasswordMutation = useResetPassword();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();
    const nextErrors: FieldErrors = {};
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
      await resetPasswordMutation.mutateAsync({ token, newPassword, confirmPassword });
      setDone(true);
    } catch (error) {
      showApiErrorToast(error, "Could not reset password");
    }
  }

  if (!token) {
    return (
      <div className="space-y-5 text-center">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-foreground">Invalid reset link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is missing or malformed. Request a new one from the forgot password page.
          </p>
        </div>
        <Link href="/forgot-password" className="block">
          <Button type="button" className="h-11 w-full rounded-xl">
            Request New Link
          </Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <AppIcon name="status" className="size-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-foreground">Password Reset</h1>
          <p className="text-sm text-muted-foreground">Your password has been updated. Please sign in.</p>
        </div>
        <Link href="/login" className="block">
          <Button type="button" className="h-11 w-full rounded-xl">
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1 text-center">
        <h1 className="text-lg font-semibold text-foreground">Set New Password</h1>
        <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
      </div>
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
        disabled={resetPasswordMutation.isPending || newPassword.length < 8 || confirmPassword.length < 8 || newPassword !== confirmPassword}
      >
        {resetPasswordMutation.isPending ? "Saving..." : "Reset Password"}
      </Button>
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Back to login
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
