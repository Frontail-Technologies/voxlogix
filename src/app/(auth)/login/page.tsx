"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AppIcon } from "@/components/common/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/config/constants";
import { useLogin } from "@/features/auth/api/auth.mutations";
import { ApiClientError } from "@/lib/api/types";

const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter your username or email"),
  password: z.string().min(1, "Enter your password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const roleRedirects: Record<string, string> = {
  MASTER: "/master/dashboard",
  ADMIN: "/admin/dashboard",
  PLANNER: "/planner/dashboard",
  EXECUTION: "/execution/dashboard",
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        const role = response.data?.role ?? "";
        router.push(roleRedirects[role] ?? "/unauthorized");
      },
      onError: (error) => {
        const message =
          error instanceof ApiClientError ? error.message : "Unable to sign in.";
        toast.error(message);
      },
    });
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary),transparent_72%),transparent_58%)] blur-2xl dark:h-80 dark:bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary),transparent_45%),transparent_60%)]" />
      <Card className="relative w-full max-w-md rounded-3xl border-border bg-card/92 shadow-xl shadow-foreground/5 backdrop-blur">
        <CardHeader className="items-center justify-center pb-3 text-center">
          <div className="relative h-28 w-32 max-w-full">
            <Image
              src="/images/logo-dark.png"
              alt="VoxLogiX"
              fill
              priority
              sizes="128px"
              className="object-contain dark:hidden"
            />
            <Image
              src="/images/logo-light.png"
              alt="VoxLogiX"
              fill
              priority
              sizes="128px"
              className="hidden object-contain dark:block"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-3">
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">
                Login to your account to continue
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                placeholder="Enter your email or username"
                className="h-11 rounded-xl bg-secondary/70"
                {...register("identifier")}
              />
              {errors.identifier ? (
                <p className="text-xs text-destructive">{errors.identifier.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-11 rounded-xl bg-secondary/70 pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <AppIcon
                    name={showPassword ? "eye-off" : "eye"}
                    className="size-5"
                  />
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              ) : null}
            </div>
            <div className="flex items-center justify-end">
              <Link
                className="text-sm text-foreground hover:text-primary"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {APP_NAME} secure sign-in
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
