import type { ServiceClass } from '../ServiceClass'
import type { AfterGuardHook } from './AfterGuardHook'
import type { AfterTransformHook } from './AfterTransformHook'
import type { BeforeGuardHook } from './BeforeGuardHook'
import type { BeforeTransformHook } from './BeforeTransformHook'
import type { CommandFunction } from './CommandFunction'

/**
 * The definition for a command provided by some service.
 */
export type CommandDefinition<
  MetadataType = Record<string, unknown>,
  ServiceClassType = ServiceClass,
  PayloadType = unknown,
  ParamsType = Record<string, unknown>,
  ResultType = unknown,
> = {
  commandName: string
  commandDescription: string
  metadata: MetadataType
  call: CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType>
  hooks: {
    beforeTransformInput?: BeforeTransformHook<ServiceClassType>[]
    beforeGuard?: BeforeGuardHook<ServiceClassType, PayloadType, ParamsType>[]
    afterGuard?: AfterGuardHook<ServiceClassType, ResultType, PayloadType, ParamsType>[]
    afterTransformOutput?: AfterTransformHook<ServiceClassType, ResultType>[]
  }
}
