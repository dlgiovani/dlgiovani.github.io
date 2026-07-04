export const isPtPath = (pathname: string): boolean =>
  pathname === '/pt-br' || pathname.startsWith('/pt-br/');

// Counterpart URLs for pages mirrored by a plain /pt-br prefix swap. Pages
// whose slug differs per locale pass explicit overrides instead.
export function altHrefs(pathname: string): { en: string; pt: string } {
  const onPt = isPtPath(pathname);
  return {
    en: onPt ? pathname.replace(/^\/pt-br/, '') || '/' : pathname,
    pt: onPt ? pathname : '/pt-br' + (pathname === '/' ? '/' : pathname),
  };
}
