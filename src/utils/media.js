export function buildImageUrl(urlOrPath) {
  if (!urlOrPath) return "";
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath;
  }
  const base = import.meta.env.VITE_IMAGE_BASE_URL || "";
  if (!base) return urlOrPath;
  const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathClean = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${baseClean}${pathClean}`;
}

