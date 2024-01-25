import type { Service } from '@purista/core'

export type HealthFunction<T extends Service> = (this: T) => Promise<void>
