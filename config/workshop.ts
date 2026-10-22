// Instructor: replace this with the lightbox URL before the workshop.
// No trailing slash. Students should not edit this file.
export const LIGHTBOX_API_URL = 'REPLACE_WITH_WORKSHOP_LIGHTBOX_URL';

export function isLightboxConfigured() {
  return LIGHTBOX_API_URL.startsWith('http://') || LIGHTBOX_API_URL.startsWith('https://');
}
