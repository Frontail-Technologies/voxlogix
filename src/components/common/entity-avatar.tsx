import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type EntityAvatarProps = {
  initials: string;
  className?: string;
  fallbackClassName?: string;
};

export function EntityAvatar({
  initials,
  className,
  fallbackClassName,
}: EntityAvatarProps) {
  return (
    <Avatar
      className={cn(
        "rounded-full border border-primary/20 bg-primary/12",
        className,
      )}
    >
      <AvatarFallback
        className={cn("font-semibold text-primary", fallbackClassName)}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
