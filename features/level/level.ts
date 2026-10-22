export function calculateLevelDegrees(radians: number) {
  // TODO LEVEL 2
  // Convert radians to degrees.
  //
  // Hints:
  // - A full circle is 360 degrees, which is the same as 2 * Math.PI radians.
  // - Math.PI is built in.
  // - Keep the sign. Left and right tilts should not both become positive.
  return 999;
}

export function isLevel(degrees: number) {
  // TODO LEVEL 3
  // Return true when degrees is close enough to zero to call the phone level.
  //
  // Hints:
  // - degrees === 0 is too strict. The sensor jitters.
  // - Use a small tolerance, a couple of degrees.
  // - Check both sides of zero. Negative degrees can be level too.
  return false;
}
