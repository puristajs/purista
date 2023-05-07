/**
 * Convert milliseconds into seconds and round decimal to integer if needed.
 *
 * @param ms Value in millisconads
 * @returns rounded value in seconds
 */
export const msToSec = (ms: number) => {
  if (ms === 0) {
    return 0
  }
  return Math.round(ms / 1000)
}
