import type { Service } from '../../Service'
import { AfterGuardHook } from './AfterGuardHook'
import { BeforeGuardHook } from './BeforeGuardHook'
import { CommandFunction } from './CommandFunction'
import { TransformHook } from './TransformHook'

/**
 * The definition for a command provided by some service.
 */
export type CommandDefinition<
  MetadataType = Record<string, unknown>,
  ServiceClassType = Service,
  PayloadType = unknown,
  ParamsType = Record<string, unknown>,
  ResultType = unknown,
> = {
  commandName: string
  commandDescription: string
  metadata: MetadataType
  call: CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType>
  hooks: {
    transformInput?: TransformHook<ServiceClassType, PayloadType, ParamsType>[]
    beforeGuard?: BeforeGuardHook<ServiceClassType, PayloadType, ParamsType>[]
    afterGuard?: AfterGuardHook<ServiceClassType, ResultType>[]
  }
}
