import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type EntityAvatarProps = {
  initials: string;
  imageUrl?: string;
  className?: string;
  fallbackClassName?: string;
};

export function EntityAvatar({
  initials,
  imageUrl,
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
      {imageUrl ? <AvatarImage src={imageUrl} alt={initials} /> : null}
      <AvatarFallback
        className={cn("font-semibold text-primary", fallbackClassName)}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
