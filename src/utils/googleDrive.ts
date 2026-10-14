/**
 * Google Drive Video Utilities
 * Extracts file IDs and generates embed preview URLs for Google Drive video streams
 */

export function extractGoogleDriveId(input: string | undefined | null): string | null {
  if (!input) return null;
  const str = input.trim();

  // Pattern 1: /file/d/([a-zA-Z0-9_-]+)
  const matchFileD = str.match(/\/file\/d\/([a-zA-Z0-9_-]{15,})/);
  if (matchFileD && matchFileD[1]) {
    return matchFileD[1];
  }

  // Pattern 2: id=([a-zA-Z0-9_-]+)
  const matchIdParam = str.match(/[?&]id=([a-zA-Z0-9_-]{15,})/);
  if (matchIdParam && matchIdParam[1]) {
    return matchIdParam[1];
  }

  // Pattern 3: Direct alphanumeric ID
  if (/^[a-zA-Z0-9_-]{20,60}$/.test(str)) {
    return str;
  }

  return null;
}

export function getGoogleDrivePreviewUrl(idOrUrl: string): string {
  const id = extractGoogleDriveId(idOrUrl) || idOrUrl;
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function getGoogleDriveViewUrl(idOrUrl: string): string {
  const id = extractGoogleDriveId(idOrUrl) || idOrUrl;
  return `https://drive.google.com/file/d/${id}/view`;
}

export function isGoogleDriveUrl(url: string | undefined | null): boolean {
  return Boolean(extractGoogleDriveId(url));
}

/**
 * Pinterest Embed Utilities
 * Detects Pinterest URLs and extracts embed preview iframe URLs
 */
export function isPinterestUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return /assets\.pinterest\.com\/ext\/embed\.html|pinterest\.com|pin\.it/i.test(url);
}

export function extractPinterestPinId(input: string | undefined | null): string | null {
  if (!input) return null;
  const str = input.trim();
  const iframeMatch = str.match(/src=["']([^"']+)["']/i);
  const target = iframeMatch ? iframeMatch[1] : str;

  const embedMatch = target.match(/assets\.pinterest\.com\/ext\/embed\.html\?id=(\d+)/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  const pinMatch = target.match(/pin\/(\d+)/i);
  if (pinMatch && pinMatch[1]) return pinMatch[1];

  const idParamMatch = target.match(/[?&]id=(\d+)/i);
  if (idParamMatch && idParamMatch[1] && target.includes('pinterest')) return idParamMatch[1];

  if (/^\d{15,22}$/.test(target)) return target;

  return null;
}

export function extractPinterestEmbedUrl(input: string | undefined | null): string | null {
  if (!input) return null;
  const pinId = extractPinterestPinId(input);
  if (pinId) {
    return `https://assets.pinterest.com/ext/embed.html?id=${pinId}`;
  }
  return null;
}

export function getPinterestPinUrl(pinIdOrUrl: string): string {
  const pinId = extractPinterestPinId(pinIdOrUrl);
  if (pinId) {
    return `https://www.pinterest.com/pin/${pinId}/`;
  }
  return pinIdOrUrl;
}

