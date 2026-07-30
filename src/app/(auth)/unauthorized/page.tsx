import { ErrorStatePage } from "@/components/common/error-state-page";

export default function UnauthorizedPage() {
  return (
    <ErrorStatePage
      icon="permissions"
      title="Access denied"
      description="Your account does not have permission to open this page."
      actionLabel="Back to dashboard"
      actionHref="/master/dashboard"
    />
  );
}
