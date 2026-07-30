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
  ChatCircle,
  CheckCircle,
  ClipboardText,
  CreditCard,
  Database,
  DotsThreeVertical,
  DownloadSimple,
  Eye,
  EyeSlash,
  Funnel,
  GearSix,
  Gauge,
  ImageSquare,
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
  SpeakerHigh,
  SquaresFour,
  StopCircle,
  Sun,
  Trash,
  UploadSimple,
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
  | "chat"
  | "companies"
  | "dashboard"
  | "database"
  | "download"
  | "eye"
  | "eye-off"
  | "equipment"
  | "filter"
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
  | "sign-out"
  | "sidebar"
  | "settings"
  | "speaker"
  | "status"
  | "stop"
  | "storage"
  | "sun"
  | "image"
  | "trash"
  | "upload"
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
  chat: ChatCircle,
  companies: Buildings,
  dashboard: Gauge,
  database: Database,
  download: DownloadSimple,
  eye: Eye,
  "eye-off": EyeSlash,
  equipment: Wrench,
  filter: Funnel,
  logs: ClipboardText,
  more: DotsThreeVertical,
  modules: SquaresFour,
  notifications: Bell,
  image: ImageSquare,
  package: Package,
  permissions: LockKey,
  planet: Planet,
  plus: Plus,
  planning: ListChecks,
  profile: UserCircle,
  reports: ChartBar,
  rocket: RocketLaunch,
  search: MagnifyingGlass,
  "sign-out": ArrowLeft,
  sidebar: ListDashes,
  settings: GearSix,
  speaker: SpeakerHigh,
  status: CheckCircle,
  stop: StopCircle,
  storage: ArchiveBox,
  sun: Sun,
  trash: Trash,
  upload: UploadSimple,
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


