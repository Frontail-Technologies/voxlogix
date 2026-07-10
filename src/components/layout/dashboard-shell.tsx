"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AppIcon } from "@/components/common/app-icon";
import { ThemeWhoosh } from "@/components/common/theme-whoosh";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRef, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ROLE_NAVIGATION } from "@/config/navigation";
import { shouldShowMobileHeader } from "@/config/layout";
import { ROLE_LABELS, type UserRole } from "@/config/roles";
import { cn } from "@/lib/utils";

function roleFromPath(pathname: string): UserRole {
  if (pathname.startsWith("/master")) return "master";
  if (pathname.startsWith("/planner")) return "planner";
  if (pathname.startsWith("/execution")) return "execution";
  return "admin";
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const whooshTimer = useRef<number | null>(null);
  const [themeWhooshActive, setThemeWhooshActive] = useState(false);
  const role = roleFromPath(pathname);
  const navItems = ROLE_NAVIGATION[role];
  const showMobileHeader = shouldShowMobileHeader(pathname);
  const darkMode = resolvedTheme === "dark";

  function toggleTheme(checked: boolean) {
    if (whooshTimer.current) {
      clearTimeout(whooshTimer.current);
    }

    setThemeWhooshActive(true);
    window.setTimeout(() => {
      setTheme(checked ? "dark" : "light");
    }, 130);
    whooshTimer.current = window.setTimeout(() => {
      setThemeWhooshActive(false);
      whooshTimer.current = null;
    }, 460);
  }

  return (
    <SidebarProvider>
      <ThemeWhoosh active={themeWhooshActive} />
      <Sidebar
        collapsible="icon"
        className="border-0 group-data-[collapsible=icon]:border-r-0"
      >
        <SidebarHeader className="border-b border-sidebar-border/55 p-4 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-5">
          <div className="flex w-full min-w-0 items-center justify-between gap-3 group-data-[collapsible=icon]:flex-col">
            <div className="relative flex h-12 w-36 items-center overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden">
              <Image
                src="/images/logo-light.png"
                alt="VoxLogiX"
                fill
                priority
                sizes="128px"
                className="object-contain"
              />
            </div>
            <div className="flex shrink-0 items-center gap-1 group-data-[collapsible=icon]:flex-col">
              <SidebarTrigger
                size="icon-lg"
                className="rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:bg-sidebar-primary group-data-[collapsible=icon]:text-sidebar-primary-foreground group-data-[collapsible=icon]:hover:bg-sidebar-primary [&_svg]:size-5"
              />
            </div>
          </div>
        </SidebarHeader>
        {/* <SidebarSeparator className="group-data-[collapsible=icon]:hidden" /> */}
        <SidebarContent>
          <SidebarGroup className="px-3 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-5">
            <SidebarGroupLabel className="px-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/55">
              {ROLE_LABELS[role]} Panel
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {navItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "h-10 rounded-xl px-3 text-sidebar-foreground/86 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:p-0",
                          active &&
                            "!bg-sidebar-primary !text-sidebar-primary-foreground shadow-sm shadow-sidebar-primary/20 hover:!bg-sidebar-primary hover:!text-sidebar-primary-foreground data-active:!bg-sidebar-primary data-active:!text-sidebar-primary-foreground",
                        )}
                      >
                        <AppIcon name={item.icon} className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {/* <SidebarSeparator className="group-data-[collapsible=icon]:hidden" /> */}
        <SidebarFooter className="gap-3 border-t border-sidebar-border/55 p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-sidebar-foreground/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:px-0">
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
              <AppIcon name="sun" className="size-4" />
              <span className="text-sm font-medium">Theme</span>
            </div>
            <Switch
              aria-label="Toggle dark theme"
              size="sm"
              checked={darkMode}
              onCheckedChange={toggleTheme}
            />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/70 p-2 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:border-sidebar-accent/70 group-data-[collapsible=icon]:p-1">
            <Avatar className="size-10 group-data-[collapsible=icon]:size-8">
              <AvatarFallback>VX</AvatarFallback>
            </Avatar>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold">Master Super</p>
              <p className="text-xs text-sidebar-foreground/70">Mock session</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {showMobileHeader ? (
          <header className="sticky top-0 z-20 border-b border-border bg-card/95 px-3 py-2 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="relative h-12 w-24 md:w-44 lg:hidden">
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
              </div>
              <div className="hidden w-full max-w-sm items-center gap-2 rounded-xl border border-border bg-background px-3 lg:flex">
                <AppIcon name="search" className="size-4 text-muted-foreground" />
                <Input
                  aria-label="Search anything"
                  placeholder="Search anything..."
                  className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="size-9 rounded-lg"
                  onClick={() => toggleTheme(!darkMode)}
                >
                  <AppIcon name="sun" className="size-4" />
                  <span className="sr-only">Theme toggle placeholder</span>
                </Button>
                <SidebarTrigger
                  size="icon-lg"
                  className="size-9 rounded-lg [&>svg]:!size-5"
                />
              </div>
            </div>
          </header>
        ) : null}
        <div
          className={cn(
            "mx-auto w-full container px-3 sm:px-4 sm:py-6 lg:px-8",
            showMobileHeader ? "py-4" : "py-5",
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
