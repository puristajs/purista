import type { Constructor } from './Constructor.js'

export type IsConstructor<T> = T extends Constructor ? true : false
