import { ErrorStatePage } from "@/components/common/error-state-page";

export default function NotFound() {
  return (
    <ErrorStatePage
      icon="search"
      title="Page not found"
      description="This page does not exist or may have been moved."
      actionLabel="Back to dashboard"
      actionHref="/master/dashboard"
    />
  );
}
