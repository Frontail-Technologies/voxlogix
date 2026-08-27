import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
  /** "auto" (default) swaps by page theme via CSS — dark arrows on light
   * pages, light arrows on dark pages. Fixed-dark surfaces that don't follow
   * the page theme toggle (e.g. the Footer) should pass "light" to always
   * get the light-arrow mark regardless of the page's own theme. */
  mark?: "auto" | "light" | "dark";
};

const sizeClasses = {
  sm: { root: "h-9", image: "h-9", text: "text-xl" },
  md: { root: "h-10", image: "h-10", text: "text-xl" },
  lg: { root: "h-14", image: "h-14", text: "text-2xl" },
};

export function BrandLogo({ className, markClassName, textClassName, size = "md", mark = "auto" }: BrandLogoProps) {
  const classes = sizeClasses[size];
  // Both mark images share the same 900x792 intrinsic size, so the wrapper's
  // box comes from its own aspect-ratio rather than either <Image>'s normal
  // flow — needed because in "auto" mode both images are absolutely stacked
  // and toggled by the dark: variant, so neither can drive the parent's size.
  const imageClasses = cn("absolute inset-0 h-full w-full object-contain", classes.image);

  return (
    <span className={cn("inline-flex items-center gap-2", classes.root, className)}>
      <span
        className={cn("relative inline-flex h-full aspect-900/792 shrink-0 overflow-visible", markClassName)}
        aria-hidden="true"
      >
        {mark !== "light" && (
          <Image
            src="/images/logo-dark.png"
            alt=""
            width={900}
            height={792}
            priority
            className={cn(imageClasses, mark === "auto" && "dark:hidden")}
          />
        )}
        {mark !== "dark" && (
          <Image
            src="/images/logo-light.png"
            alt=""
            width={900}
            height={792}
            priority
            className={cn(imageClasses, mark === "auto" && "hidden dark:block")}
          />
        )}
      </span>
      <span
        className={cn("shrink-0 font-bold leading-none tracking-tight whitespace-nowrap text-foreground", classes.text, textClassName)}
      >
        VoxLogiX
      </span>
    </span>
  );
}
