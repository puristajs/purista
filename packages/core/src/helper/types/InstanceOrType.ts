import type { Constructor } from './Constructor.js'

export type InstanceOrType<T> = T extends Constructor ? InstanceType<T> : T
