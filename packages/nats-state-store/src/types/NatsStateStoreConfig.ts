import type { Prettify } from '@purista/core'
import type { ConnectionOptions, KvOptions } from 'nats'

export type NatsStateStoreConfig = Prettify<
  {
    keyValueStoreName: string
  } & ConnectionOptions &
    Partial<KvOptions>
>
