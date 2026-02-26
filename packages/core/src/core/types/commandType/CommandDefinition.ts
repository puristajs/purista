import type { Schema } from '../../../schema/index.js'

import type { DefinitionEventBridgeConfig } from '../DefinitionEventBridgeConfig.js'
import type { InvokeList } from '../InvokeList.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { CommandAfterGuardHook } from './CommandAfterGuardHook.js'
import type { CommandBeforeGuardHook } from './CommandBeforeGuardHook.js'
import type { CommandDefinitionMetadataBase } from './CommandDefinitionMetadataBase.js'
import type { CommandFunction } from './CommandFunction.js'
import type { CommandTransformInputHook } from './CommandTransformInputHook.js'
import type { CommandTransformOutputHook } from './CommandTransformOutputHook.js'

/**
 * The definition for a command provided by some service.
 *
 * @group Command
 */
export type CommandDefinition<
	S extends ServiceClass,
	MessagePayloadType,
	MessageParamsType,
	TransformInputPayload,
	TransformInputParams,
	FunctionPayloadType,
	FunctionParamsType,
	FunctionOutputType,
	FinalFunctionOutputType,
	TransformOutputHookOutput,
	Resources extends Record<string, unknown>,
	Invokes extends InvokeList,
	StreamInvokes extends StreamInvokeList,
	EmitList extends Record<string, Schema>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	MetadataType extends CommandDefinitionMetadataBase = CommandDefinitionMetadataBase,
> = {
	/** the name of the command */
	commandName: string
	/** the description of the command */
	commandDescription: string
	/** the metadata of the command */
	metadata: MetadataType
	/** config information for event bridge */
	eventBridgeConfig: DefinitionEventBridgeConfig
	/** the command function */
	call: CommandFunction<
		S,
		MessagePayloadType,
		MessageParamsType,
		FunctionPayloadType,
		FunctionParamsType,
		FunctionOutputType,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList
	>
	/** the eventName for the command response */
	eventName?: string
	/** hooks of command */
	hooks: {
		transformInput?: {
			transformInputSchema: Schema
			transformParameterSchema: Schema
			transformFunction: CommandTransformInputHook<
				S,
				MessagePayloadType,
				MessageParamsType,
				TransformInputPayload,
				TransformInputParams,
				FunctionPayloadType,
				FunctionParamsType
			>
		}
		beforeGuard?: Record<
			string,
			CommandBeforeGuardHook<
				S,
				MessagePayloadType,
				MessageParamsType,
				FunctionPayloadType,
				FunctionParamsType,
				Resources,
				Invokes,
				StreamInvokes,
				EmitList
			>
		>
		afterGuard?: Record<
			string,
			CommandAfterGuardHook<
				S,
				MessagePayloadType,
				MessageParamsType,
				FunctionPayloadType,
				FunctionParamsType,
				FunctionOutputType,
				Resources,
				Invokes,
				StreamInvokes,
				EmitList
			>
		>
		transformOutput?: {
			transformOutputSchema: Schema
			transformFunction: CommandTransformOutputHook<
				S,
				MessagePayloadType,
				MessageParamsType,
				FinalFunctionOutputType,
				FunctionParamsType,
				TransformOutputHookOutput
			>
		}
	}
	invokes: Invokes
	streamInvokes: StreamInvokes
	emitList: EmitList
	queueInvokes: QueueInvokes
}
