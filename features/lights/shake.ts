export function isShake(x: number, y: number, z: number) {
  const strength = Math.sqrt(x * x + y * y + z * z);
  return strength > 2;
}
