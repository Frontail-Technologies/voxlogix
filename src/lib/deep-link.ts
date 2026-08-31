// Whitelist for the public /open?path=... redirector (see app/open/page.tsx). Deliberately a
// closed allowlist match, not a substring/prefix check — path.startsWith("/") would still let
// "/../evil", "//evil.com", or an unsupported route prefix through. Anything that isn't an
// exact match for one of these patterns is rejected outright, regardless of encoding (the
// browser/searchParams already decode the query string before this ever sees it, so an
// encoded traversal or encoded scheme collapses to its literal form and still fails the
// anchored match below).
const UUID_PATTERN = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const LOG_PATH_PATTERN = new RegExp(`^/logs/(${UUID_PATTERN})$`, "i");

export type OpenLinkTarget = {
  /** The voxlogix:// URI to attempt opening the app with — built from the validated id only,
   * never from the raw query string. */
  appUri: string;
};

// Returns null for anything not on the whitelist: wrong host/scheme smuggled into the path,
// javascript:/data:/file:/intent:, a bare custom-scheme handed back directly, traversal,
// unsupported prefixes, empty or malformed ids — all fail the same single anchored regex.
export function resolveOpenLinkTarget(rawPath: string | null): OpenLinkTarget | null {
  if (!rawPath) return null;

  const match = LOG_PATH_PATTERN.exec(rawPath);
  if (!match) return null;

  const logId = match[1].toLowerCase();
  return { appUri: `voxlogix://logs/${logId}` };
}
