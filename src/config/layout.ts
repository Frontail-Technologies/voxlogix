export const MOBILE_HEADER_CONFIG = {
  hideOnNestedRoutes: true,
  nestedRouteDepth: 2,
  alwaysShow: [] as string[],
  alwaysHide: [] as string[],
};

export function shouldShowMobileHeader(pathname: string) {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  if (MOBILE_HEADER_CONFIG.alwaysHide.includes(normalizedPath)) {
    return false;
  }

  if (MOBILE_HEADER_CONFIG.alwaysShow.includes(normalizedPath)) {
    return true;
  }

  if (!MOBILE_HEADER_CONFIG.hideOnNestedRoutes) {
    return true;
  }

  const routeDepth = normalizedPath.split("/").filter(Boolean).length;

  return routeDepth <= MOBILE_HEADER_CONFIG.nestedRouteDepth;
}
