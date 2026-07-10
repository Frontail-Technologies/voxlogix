"use client";

import {
  Activity,
  ArrowLeft,
  ArchiveBox,
  Bell,
  Buildings,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
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
  ListDashes,
  Microphone,
  Package,
  Planet,
  Plus,
  RocketLaunch,
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
  | "arrow-left"
  | "admins"
  | "ai"
  | "billing"
  | "calendar"
  | "caret-down"
  | "caret-left"
  | "caret-right"
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
  | "planet"
  | "plus"
  | "planning"
  | "profile"
  | "reports"
  | "rocket"
  | "search"
  | "sidebar"
  | "settings"
  | "status"
  | "storage"
  | "sun"
  | "users"
  | "voice"
  | "warning";

const iconMap = {
  activity: Activity,
  "arrow-left": ArrowLeft,
  admins: UserGear,
  ai: Sparkle,
  billing: CreditCard,
  calendar: CalendarBlank,
  "caret-down": CaretDown,
  "caret-left": CaretLeft,
  "caret-right": CaretRight,
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
  planet: Planet,
  plus: Plus,
  planning: ListChecks,
  profile: UserCircle,
  reports: ChartBar,
  rocket: RocketLaunch,
  search: MagnifyingGlass,
  sidebar: ListDashes,
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
