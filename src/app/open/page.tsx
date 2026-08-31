"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AppIcon } from "@/components/common/app-icon";
import { BrandLogo } from "@/components/common/brand-logo";
import { Button } from "@/components/ui/button";
import { resolveOpenLinkTarget } from "@/lib/deep-link";

// Public, unauthenticated share-link landing page: https://voxlogix.in/open?path=/logs/<id>
// A raw voxlogix://... custom-scheme link shows as plain, non-clickable text in WhatsApp/
// Telegram — this HTTPS page is the share-friendly stand-in. It only ever accepts a
// whitelisted internal `path` (see resolveOpenLinkTarget) and builds the real app link
// itself; the query string is never treated as a URL to redirect to. The URL carries zero
// authorization — the app's own auth/tenant checks are what actually gate the log.
function OpenLinkPageContent() {
  const searchParams = useSearchParams();
  const target = resolveOpenLinkTarget(searchParams.get("path"));
  const hasAttemptedAutoOpen = useRef(false);
  const [autoOpenAttempted, setAutoOpenAttempted] = useState(false);

  useEffect(() => {
    if (!target || hasAttemptedAutoOpen.current) return;
    hasAttemptedAutoOpen.current = true;
    // Attempted once, silently — most browsers either open the app or simply stay on this
    // page with no visible error, which is exactly the desired fallback behavior. The
    // explicit button below is the reliable path (a real click, not an automatic
    // navigation, is far less likely to be blocked).
    window.location.href = target.appUri;
    setAutoOpenAttempted(true);
  }, [target]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>

        {target ? (
          <>
            <div className="mx-auto mt-6 flex size-12 items-center justify-center rounded-2xl bg-primary/14 text-primary">
              <AppIcon name="logs" className="size-6" />
            </div>
            <h1 className="mt-4 text-xl font-semibold tracking-normal text-foreground">
              Open this log in VoxLogiX
            </h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
              You need the VoxLogiX app installed to view this log.
            </p>
            <Button
              className="mt-6 h-10 w-full rounded-xl"
              onClick={() => {
                window.location.href = target.appUri;
              }}
            >
              Open in VoxLogiX
            </Button>
            <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
              {autoOpenAttempted
                ? "If nothing happened, use the button above."
                : "Opening the app…"}
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mt-6 flex size-12 items-center justify-center rounded-2xl bg-destructive/12 text-destructive">
              <AppIcon name="warning" className="size-6" />
            </div>
            <h1 className="mt-4 text-xl font-semibold tracking-normal text-foreground">
              This link isn&apos;t valid
            </h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
              The link may be incomplete or no longer supported. Ask for a new share link from VoxLogiX.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default function OpenLinkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <OpenLinkPageContent />
    </Suspense>
  );
}
