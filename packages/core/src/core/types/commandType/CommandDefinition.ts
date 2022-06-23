import type { Service } from '../../Service'
import { AfterGuardHook } from './AfterGuardHook'
import { AfterTransformHook } from './AfterTransformHook'
import { BeforeGuardHook } from './BeforeGuardHook'
import { BeforeTransformHook } from './BeforeTransformHook'
import { CommandFunction } from './CommandFunction'

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
    beforeTransformInput?: BeforeTransformHook<ServiceClassType>[]
    beforeGuard?: BeforeGuardHook<ServiceClassType, PayloadType, ParamsType>[]
    afterGuard?: AfterGuardHook<ServiceClassType, ResultType, PayloadType, ParamsType>[]
    afterTransformOutput?: AfterTransformHook<ServiceClassType, ResultType>[]
  }
}
