"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { AppIcon } from "@/components/common/app-icon";
import { DynamicBreadcrumbProvider } from "@/components/common/page-header-navigation";
import { ThemeWhoosh } from "@/components/common/theme-whoosh";
import { LogoutButton } from "@/components/common/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRef, useState, useSyncExternalStore } from "react";
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
import { prefetchAdminDashboardSummary } from "@/features/admin-dashboard/api/dashboard.queries";
import { getEquipment } from "@/features/admin-equipment/api/equipment.queries";
import { adminEquipmentKeys } from "@/features/admin-equipment/api/equipment.keys";
import { getLogs } from "@/features/logs/api/log.queries";
import { adminLogKeys } from "@/features/logs/api/log.keys";
import { getAdmins } from "@/features/master-admins/api/admin.queries";
import { adminKeys } from "@/features/master-admins/api/admin.keys";
import { getCompanies } from "@/features/master-companies/api/company.queries";
import { companyKeys } from "@/features/master-companies/api/company.keys";
import { getModules } from "@/features/master-modules/api/module.queries";
import { moduleKeys } from "@/features/master-modules/api/module.keys";
import { getUsageOverview } from "@/features/master-usage/api/usage.queries";
import { usageKeys } from "@/features/master-usage/api/usage.keys";
import { getActivities } from "@/features/master-activities/api/activity.queries";
import { activityKeys } from "@/features/master-activities/api/activity.keys";
import { listQueryOptions, detailQueryOptions } from "@/lib/api/query-options";
import { useAuth } from "@/features/auth/auth-provider";
import { shouldShowMobileHeader } from "@/config/layout";
import { ROLE_LABELS, ROLE_SESSION_IDENTITY, type UserRole } from "@/config/roles";
import { cn } from "@/lib/utils";

function roleFromPath(pathname: string): UserRole {
  if (pathname.startsWith("/master")) return "master";
  if (pathname.startsWith("/planner")) return "planner";
  if (pathname.startsWith("/execution")) return "execution";
  return "admin";
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, company } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const whooshTimer = useRef<number | null>(null);
  const [themeWhooshActive, setThemeWhooshActive] = useState(false);
  const role = roleFromPath(pathname);
  const adminModulesQuery = useQuery({
    queryKey: moduleKeys.list({ page: 1, limit: 100, status: "ACTIVE" }),
    queryFn: () => getModules({ page: 1, limit: 100, status: "ACTIVE" }),
    enabled: role === "admin",
    ...listQueryOptions,
  });
  const enabledAdminModules = new Set(
    (adminModulesQuery.data?.data ?? []).map((module) => module.name.trim().toLowerCase()),
  );
  const navItems = ROLE_NAVIGATION[role].filter((item) => {
    if (role !== "admin" || !item.requiredModules?.length) return true;
    if (adminModulesQuery.isLoading || adminModulesQuery.isError) return false;
    return item.requiredModules.some((moduleName) => enabledAdminModules.has(moduleName));
  });
  const showMobileHeader = shouldShowMobileHeader(pathname);
  const hasFixedBottomActions =
    pathname.endsWith("/new") ||
    pathname.endsWith("/edit") ||
    pathname.includes("/create-log");
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const darkMode = mounted && resolvedTheme === "dark";
  const sessionName = user?.fullName ?? ROLE_SESSION_IDENTITY[role].name;
  const sessionInitials = user?.initials ?? ROLE_SESSION_IDENTITY[role].initials;
  const sessionMeta = company?.name ?? ROLE_LABELS[role];

  function prefetchRoute(href: string) {
    if (href === "/admin/dashboard") void prefetchAdminDashboardSummary(queryClient);
    else if (href === "/admin/logs") void queryClient.prefetchQuery({ queryKey: adminLogKeys.list({ page: 1, limit: 20 }), queryFn: () => getLogs({ page: 1, limit: 20 }), ...listQueryOptions });
    else if (href === "/admin/equipment") void queryClient.prefetchQuery({ queryKey: adminEquipmentKeys.list({ page: 1, limit: 20 }), queryFn: () => getEquipment({ page: 1, limit: 20 }), ...listQueryOptions });
    else if (href === "/admin/users") void queryClient.prefetchQuery({ queryKey: adminKeys.list({ page: 1, limit: 20 }), queryFn: () => getAdmins({ page: 1, limit: 20 }), ...listQueryOptions });
    else if (href === "/admin/modules" || href === "/master/modules") void queryClient.prefetchQuery({ queryKey: moduleKeys.list({ page: 1, limit: 20 }), queryFn: () => getModules({ page: 1, limit: 20 }), ...listQueryOptions });
    else if (href === "/master/companies") void queryClient.prefetchQuery({ queryKey: companyKeys.list({ page: 1, limit: 20 }), queryFn: () => getCompanies({ page: 1, limit: 20 }), ...listQueryOptions });
    else if (href === "/master/admins") void queryClient.prefetchQuery({ queryKey: adminKeys.list({ page: 1, limit: 20 }), queryFn: () => getAdmins({ page: 1, limit: 20 }), ...listQueryOptions });
    else if (href === "/master/usage") void queryClient.prefetchQuery({ queryKey: usageKeys.overview(undefined), queryFn: () => getUsageOverview(undefined), ...detailQueryOptions });
    else if (href === "/master/activities") void queryClient.prefetchQuery({ queryKey: activityKeys.list({ page: 1, limit: 20 }), queryFn: () => getActivities({ page: 1, limit: 20 }), ...listQueryOptions });
  }

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
    <DynamicBreadcrumbProvider>
      <SidebarProvider>
      <ThemeWhoosh active={themeWhooshActive} />
      <Sidebar
        collapsible="icon"
        className="border-0 group-data-[collapsible=icon]:border-r-0"
      >
        <SidebarHeader className="border-b border-sidebar-border/55 p-4 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-5">
          <div className="flex w-full min-w-0 items-center justify-between gap-3 group-data-[collapsible=icon]:flex-col">
            <div className="relative flex h-12 w-14 items-center overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden">
              <Image
                src="/images/logo-light.png"
                alt="VoxLogiX"
                fill
                priority
                sizes="56px"
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
                        onMouseEnter={() => prefetchRoute(item.href)}
                        onFocus={() => prefetchRoute(item.href)}
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
          <div className="flex items-center gap-2 rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/70 p-2 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:border-sidebar-accent/70 group-data-[collapsible=icon]:p-1">
            <Avatar className="size-10 rounded-full group-data-[collapsible=icon]:size-8">
              {user?.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={sessionName} /> : null}
              <AvatarFallback>{sessionInitials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold">{sessionName}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">{sessionMeta}</p>
            </div>
            <LogoutButton iconOnly variant="ghost" className="shrink-0 text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {showMobileHeader ? (
          <header className="sticky top-0 z-20 border-b border-border bg-card/95 px-3 py-2 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="relative h-12 w-14 lg:hidden">
                  <Image
                    src="/images/logo-dark.png"
                    alt="VoxLogiX"
                    fill
                    priority
                    sizes="56px"
                    className="object-contain dark:hidden"
                  />
                  <Image
                    src="/images/logo-light.png"
                    alt="VoxLogiX"
                    fill
                    priority
                    sizes="56px"
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
            "mx-auto w-full container px-3 sm:px-4 sm:pt-6 lg:px-8",
            showMobileHeader ? "pt-4" : "pt-5",
            hasFixedBottomActions ? "pb-40" : "pb-5 sm:pb-6",
          )}
        >
          {children}
        </div>
      </SidebarInset>
      </SidebarProvider>
    </DynamicBreadcrumbProvider>
  );
}




