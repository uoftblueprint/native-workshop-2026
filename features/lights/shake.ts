export function isShake(x: number, y: number, z: number) {
  // TODO LIGHTS 3
  // Return true only for a hard shake.
  //
  // Hints:
  // - strength squares x, y, and z, adds those squares, then takes the square root.
  // - Squaring drops the sign. A negative axis still counts, and a shake spread across the axes still adds up.
  // - A still phone is near 1, because of gravity. threshold is 0, so gravity currently counts as a shake.
  // - Raise threshold to a number a bit above 1. A small bump should stay false.
  const strength = Math.sqrt(x * x + y * y + z * z);
  const threshold = 0;
  return strength > threshold;
}
