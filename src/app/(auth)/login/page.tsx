"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AppIcon } from "@/components/common/app-icon";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { APP_NAME } from "@/config/constants";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary),transparent_72%),transparent_58%)]" />
      <Card className="relative w-full max-w-md rounded-3xl border-border bg-card/92 shadow-xl shadow-foreground/5 backdrop-blur">
        <CardHeader className="items-center justify-center pb-3 text-center">
          <div className="relative h-28 w-72 max-w-full">
            <Image
              src="/images/logo-dark.png"
              alt="VoxLogiX"
              fill
              priority
              sizes="288px"
              className="object-contain"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-6 pt-3">
          <div className="space-y-1 text-center">
            <p className="text-sm text-muted-foreground">
              Login to your account to continue
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username or Email</Label>
            <Input
              id="username"
              placeholder="Enter your email or username"
              className="h-11 rounded-xl bg-secondary/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-11 rounded-xl bg-secondary/70 pr-11"
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
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch />
              Remember me
            </label>
            <Link
              className="text-sm text-foreground hover:text-primary"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <Link
            className={buttonVariants({ className: "h-11 w-full rounded-xl" })}
            href="/master/dashboard"
          >
            Sign In
          </Link>
          <p className="text-center text-xs text-muted-foreground">
            {APP_NAME} master panel demo access
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
