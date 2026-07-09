"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon } from "@/components/common/app-icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { APP_NAME } from "@/config/constants";
import { ROLE_NAVIGATION } from "@/config/navigation";
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
  const role = roleFromPath(pathname);
  const navItems = ROLE_NAVIGATION[role];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-0">
        <SidebarHeader className="p-4 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-36 items-center overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:bg-sidebar-primary group-data-[collapsible=icon]:p-1.5">
              <Image
                src="/images/logo-light.png"
                alt="VoxLogiX"
                fill
                priority
                sizes="128px"
                className="object-contain group-data-[collapsible=icon]:p-1"
              />
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
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
        <SidebarSeparator />
        <SidebarFooter className="p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4">
          <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-2 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:border-sidebar-accent group-data-[collapsible=icon]:p-1">
            <Avatar className="size-10 group-data-[collapsible=icon]:size-8">
              <AvatarFallback>VX</AvatarFallback>
            </Avatar>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold">Master Super</p>
              <p className="text-xs text-sidebar-foreground/70">Mock session</p>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-3 ">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
                <AppIcon name="voice" className="size-4" />
              </div>
              <span className="font-semibold lg:hidden">{APP_NAME}</span>
            </div>
            <div className="hidden w-full max-w-sm items-center gap-2 rounded-xl border border-border bg-background px-3 lg:flex">
              <AppIcon name="search" className="size-4 text-muted-foreground" />
              <Input
                aria-label="Search anything"
                placeholder="Search anything..."
                className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-lg"
                className="rounded-xl bg-card"
              >
                <AppIcon name="sun" className="size-4" />
                <span className="sr-only">Theme toggle placeholder</span>
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                className="relative rounded-xl bg-card"
              >
                <AppIcon name="notifications" className="size-4" />
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[0.62rem] font-semibold text-primary-foreground">
                  2
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full container px-4 py-6 lg:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
