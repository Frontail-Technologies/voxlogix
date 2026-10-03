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
import { useForgotPassword } from "@/features/auth/api/auth.mutations";
import { showApiErrorToast } from "@/lib/api/error-toast";

type Step = "identifier" | "sent";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");

  const forgotPasswordMutation = useForgotPassword();

  async function handleIdentifierSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = identifier.trim();
    if (!value) return;

    try {
      await forgotPasswordMutation.mutateAsync({ identifier: value });
      setStep("sent");
    } catch (error) {
      showApiErrorToast(error, "Could not send reset link");
    }
  }

  async function handleResend() {
    try {
      await forgotPasswordMutation.mutateAsync({ identifier });
      toast.success("Reset link resent.");
    } catch (error) {
      showApiErrorToast(error, "Could not resend reset link");
    }
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
          {step === "identifier" ? (
            <form className="space-y-5" onSubmit={handleIdentifierSubmit} noValidate>
              <div className="space-y-1 text-center">
                <h1 className="text-lg font-semibold text-foreground">Forgot Password</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your username or email and we&apos;ll send you a password reset link.
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
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
              </Button>
              <Link className="block text-center text-sm text-primary hover:underline" href="/login">
                Back to login
              </Link>
            </form>
          ) : null}

          {step === "sent" ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                <AppIcon name="status" className="size-7" />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold text-foreground">Check your email</h1>
                <p className="text-sm text-muted-foreground">
                  If an account exists for <span className="font-medium text-foreground">{identifier}</span>, a password reset link has been sent. The link expires in 30 minutes.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline disabled:opacity-60"
                onClick={() => void handleResend()}
                disabled={forgotPasswordMutation.isPending}
              >
                Resend link
              </button>
              <Link href="/login" className="block">
                <Button type="button" variant="outline" className="h-11 w-full rounded-xl">
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
