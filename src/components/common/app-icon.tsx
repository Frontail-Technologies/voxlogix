"use client";

import {
  Activity,
  ArchiveBox,
  Bell,
  Buildings,
  CalendarBlank,
  CaretDown,
  ChartBar,
  CheckCircle,
  ClipboardText,
  CreditCard,
  Database,
  DotsThreeVertical,
  Eye,
  EyeSlash,
  GearSix,
  Gauge,
  ListChecks,
  LockKey,
  MagnifyingGlass,
  Microphone,
  Package,
  Plus,
  Sparkle,
  SquaresFour,
  Sun,
  UserCircle,
  UserGear,
  UsersThree,
  WarningCircle,
  Wrench,
  type IconProps,
} from "phosphor-react";

export type AppIconName =
  | "activity"
  | "admins"
  | "ai"
  | "billing"
  | "calendar"
  | "caret-down"
  | "companies"
  | "dashboard"
  | "database"
  | "eye"
  | "eye-off"
  | "equipment"
  | "logs"
  | "more"
  | "modules"
  | "notifications"
  | "package"
  | "permissions"
  | "plus"
  | "planning"
  | "profile"
  | "reports"
  | "search"
  | "settings"
  | "status"
  | "storage"
  | "sun"
  | "users"
  | "voice"
  | "warning";

const iconMap = {
  activity: Activity,
  admins: UserGear,
  ai: Sparkle,
  billing: CreditCard,
  calendar: CalendarBlank,
  "caret-down": CaretDown,
  companies: Buildings,
  dashboard: Gauge,
  database: Database,
  eye: Eye,
  "eye-off": EyeSlash,
  equipment: Wrench,
  logs: ClipboardText,
  more: DotsThreeVertical,
  modules: SquaresFour,
  notifications: Bell,
  package: Package,
  permissions: LockKey,
  plus: Plus,
  planning: ListChecks,
  profile: UserCircle,
  reports: ChartBar,
  search: MagnifyingGlass,
  settings: GearSix,
  status: CheckCircle,
  storage: ArchiveBox,
  sun: Sun,
  users: UsersThree,
  voice: Microphone,
  warning: WarningCircle,
} satisfies Record<AppIconName, React.ComponentType<IconProps>>;

type AppIconProps = IconProps & {
  name: AppIconName;
};

export function AppIcon({ name, weight = "duotone", ...props }: AppIconProps) {
  const Icon = iconMap[name];

  return <Icon aria-hidden="true" weight={weight} {...props} />;
}
