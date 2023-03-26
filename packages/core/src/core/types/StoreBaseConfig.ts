import { Logger } from './Logger'

export type StoreBaseConfig<Config> = {
  enableGet?: boolean
  enableSet?: boolean
  enableRemove?: boolean
  logger?: Logger
  config?: Config
}
