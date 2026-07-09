import Link from "next/link";
import { AppIcon } from "@/components/common/app-icon";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <div className="flex size-12 items-center justify-center rounded-md bg-accent text-primary">
            <AppIcon name="permissions" className="size-6" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>This placeholder route is reserved for role guard failures.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link className={buttonVariants()} href="/master/dashboard">
            Return to dashboard
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
