/**
 * Generic constructor type that preserves argument tuple inference.
 */
export type Constructor<T = unknown, A extends unknown[] = unknown[]> = new (...args: A) => T
