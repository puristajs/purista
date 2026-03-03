import type { Schema } from '../../../schema/index.js'
import type { AgentInvokeList } from '../agent/AgentInvokeList.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { CommandFunctionContext } from './CommandFunctionContext.js'

/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 *
 * @group Command
 */
export type CommandFunction<
	S extends ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	FunctionOutputType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	AgentInvokes extends AgentInvokeList = EmptyObject,
> = (
	/** the service class */
	this: S,
	/** the command function contest */
	context: CommandFunctionContext<
		MessagePayloadType,
		MessageParamsType,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		any,
		AgentInvokes
	>,
	/** the transformed and validated payload */
	payload: Readonly<FunctionPayloadType>,
	/** the transformed and validated parameter object */
	parameter: Readonly<FunctionParamsType>,
) => Promise<FunctionOutputType>
