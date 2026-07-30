"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/config/constants";
import {
  useForgotPassword,
  useResetPassword,
  useVerifyResetOtp,
} from "@/features/auth/api/auth.mutations";
import { showApiErrorToast } from "@/lib/api/error-toast";

type Step = "identifier" | "otp" | "password" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");

  const forgotPasswordMutation = useForgotPassword();
  const verifyOtpMutation = useVerifyResetOtp();
  const resetPasswordMutation = useResetPassword();

  async function handleIdentifierSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = identifier.trim();
    if (!value) return;

    try {
      await forgotPasswordMutation.mutateAsync({ identifier: value });
      toast.success("If an account matches, a verification code has been sent.");
      setStep("otp");
    } catch (error) {
      showApiErrorToast(error, "Could not send verification code");
    }
  }

  async function handleOtpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp.trim().length !== 6) return;

    try {
      await verifyOtpMutation.mutateAsync({ identifier, otp: otp.trim() });
      setStep("password");
    } catch (error) {
      showApiErrorToast(error, "Invalid or expired verification code");
    }
  }

  async function handleResend() {
    try {
      await forgotPasswordMutation.mutateAsync({ identifier });
      toast.success("Verification code resent.");
    } catch (error) {
      showApiErrorToast(error, "Could not resend verification code");
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ identifier, otp: otp.trim(), newPassword, confirmPassword });
      setStep("done");
    } catch (error) {
      showApiErrorToast(error, "Could not reset password");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary),transparent_72%),transparent_58%)] blur-2xl dark:h-80 dark:bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary),transparent_45%),transparent_60%)]" />
      <Card className="relative w-full max-w-md rounded-3xl border-border bg-card/92 shadow-xl shadow-foreground/5 backdrop-blur">
        <CardHeader className="items-center justify-center pb-3 text-center">
          <div className="relative h-28 w-72 max-w-full">
            <Image
              src="/images/logo-dark.png"
              alt={APP_NAME}
              fill
              priority
              sizes="288px"
              className="object-contain dark:hidden"
            />
            <Image
              src="/images/logo-light.png"
              alt={APP_NAME}
              fill
              priority
              sizes="288px"
              className="hidden object-contain dark:block"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-3">
          {step === "identifier" ? (
            <form className="space-y-5" onSubmit={handleIdentifierSubmit} noValidate>
              <div className="space-y-1 text-center">
                <h1 className="text-lg font-semibold text-foreground">Forgot Password</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your username or email and we&apos;ll send you a verification code.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">Username or email</Label>
                <Input
                  id="identifier"
                  placeholder="name@company.com"
                  className="h-11 rounded-xl bg-secondary/70"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="h-11 w-full rounded-xl" disabled={forgotPasswordMutation.isPending}>
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Verification Code"}
              </Button>
              <Link className="block text-center text-sm text-primary hover:underline" href="/login">
                Back to login
              </Link>
            </form>
          ) : null}

          {step === "otp" ? (
            <form className="space-y-5" onSubmit={handleOtpSubmit} noValidate>
              <div className="space-y-1 text-center">
                <h1 className="text-lg font-semibold text-foreground">Enter Verification Code</h1>
                <p className="text-sm text-muted-foreground">
                  We sent a 6-digit code to the email on file for <span className="font-medium text-foreground">{identifier}</span>.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="h-11 rounded-xl bg-secondary/70 text-center text-lg tracking-[0.5em]"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                />
              </div>
              <Button type="submit" className="h-11 w-full rounded-xl" disabled={verifyOtpMutation.isPending || otp.length !== 6}>
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setStep("identifier")}>
                  Change email
                </button>
                <button type="button" className="text-primary hover:underline" onClick={() => void handleResend()} disabled={forgotPasswordMutation.isPending}>
                  Resend code
                </button>
              </div>
            </form>
          ) : null}

          {step === "password" ? (
            <form className="space-y-5" onSubmit={handlePasswordSubmit} noValidate>
              <div className="space-y-1 text-center">
                <h1 className="text-lg font-semibold text-foreground">Set New Password</h1>
                <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" name="newPassword" type="password" minLength={6} className="h-11 rounded-xl bg-secondary/70" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" minLength={6} className="h-11 rounded-xl bg-secondary/70" required />
              </div>
              <Button type="submit" className="h-11 w-full rounded-xl" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? "Saving..." : "Reset Password"}
              </Button>
            </form>
          ) : null}

          {step === "done" ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                <AppIcon name="status" className="size-7" />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold text-foreground">Password Reset</h1>
                <p className="text-sm text-muted-foreground">Your password has been updated. You can now sign in.</p>
              </div>
              <Link href="/login" className="block">
                <Button type="button" className="h-11 w-full rounded-xl">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
