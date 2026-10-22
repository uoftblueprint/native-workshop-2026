export function calculateLevelDegrees(radians: number) {
  return radians * (180 / Math.PI);
}

export function isLevel(degrees: number) {
  return Math.abs(degrees) <= 2;
}
