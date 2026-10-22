export const LIGHTBOX_API_URL = "https://lightbox-workshop.vercel.app";

export function isLightboxConfigured() {
  return (
    LIGHTBOX_API_URL.startsWith("http://") ||
    LIGHTBOX_API_URL.startsWith("https://")
  );
}
