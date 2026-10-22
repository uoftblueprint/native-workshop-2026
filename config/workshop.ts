// Instructor: replace this with the lightbox URL before the workshop.
// No trailing slash. Students should not edit this file.
export const LIGHTBOX_API_URL = "https://lightbox-workshop.vercel.app";

export function isLightboxConfigured() {
  return (
    LIGHTBOX_API_URL.startsWith("http://") ||
    LIGHTBOX_API_URL.startsWith("https://")
  );
}
