import { AppIcon } from "@/components/common/app-icon";
import { hasValidLandingPhone, LANDING_CONTACT_PHONE } from "../constants";

export function CallButton() {
  if (!hasValidLandingPhone()) {
    return null;
  }

  return (
    <a href={`tel:${LANDING_CONTACT_PHONE}`} className="landing-icon-btn" aria-label="Call VoxLogiX">
      <AppIcon name="call" size={17} weight="bold" />
    </a>
  );
}
