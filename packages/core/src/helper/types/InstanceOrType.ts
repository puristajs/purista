import type { Constructor } from './Constructor.js'

/** Resolves a constructor to its instance type while preserving object instances. */
export type InstanceOrType<T> = T extends Constructor ? InstanceType<T> : T
