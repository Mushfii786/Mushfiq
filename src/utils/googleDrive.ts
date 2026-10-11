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
