// Set to VoxLogiX's real sales/support phone number once available — every
// Call control on the landing page reads this single source, so setting it
// here is enough to activate `tel:` everywhere. Leave null until then;
// hasValidLandingPhone() keeps the placeholder state out of individual
// components.
export const LANDING_CONTACT_PHONE: string | null = null;

export function hasValidLandingPhone(): boolean {
  return LANDING_CONTACT_PHONE !== null && LANDING_CONTACT_PHONE.trim().length > 0;
}
