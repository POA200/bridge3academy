export function getInPageHref(pathname: string, href: string) {
  if (pathname === "/" && href.startsWith("/#")) {
    return href.slice(1);
  }

  return href;
}