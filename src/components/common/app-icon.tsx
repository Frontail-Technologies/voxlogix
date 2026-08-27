"use client";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
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
  Lightbulb,
  ListChecks,
  LockKey,
  MagnifyingGlass,
  ListDashes,
  Microphone,
  Moon,
  Package,
  Phone,
  Planet,
  Plus,
  QrCode,
  RocketLaunch,
  Ruler,
  ShieldWarning,
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
  | "arrow-right"
  | "admins"
  | "ai"
  | "billing"
  | "calendar"
  | "call"
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
  | "kaizen"
  | "logs"
  | "measuring"
  | "meter"
  | "more"
  | "modules"
  | "moon"
  | "notifications"
  | "package"
  | "permissions"
  | "planet"
  | "plus"
  | "planning"
  | "profile"
  | "qr"
  | "reports"
  | "rocket"
  | "safety"
  | "search"
  | "shift"
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
  "arrow-right": ArrowRight,
  admins: UserGear,
  ai: Sparkle,
  billing: CreditCard,
  calendar: CalendarBlank,
  call: Phone,
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
  kaizen: Lightbulb,
  logs: ClipboardText,
  measuring: Ruler,
  meter: Gauge,
  more: DotsThreeVertical,
  modules: SquaresFour,
  moon: Moon,
  notifications: Bell,
  image: ImageSquare,
  package: Package,
  permissions: LockKey,
  planet: Planet,
  plus: Plus,
  planning: ListChecks,
  profile: UserCircle,
  qr: QrCode,
  reports: ChartBar,
  rocket: RocketLaunch,
  safety: ShieldWarning,
  search: MagnifyingGlass,
  shift: ArrowsClockwise,
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


