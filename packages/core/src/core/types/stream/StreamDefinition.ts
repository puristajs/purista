import type { Schema } from '../../../schema/index.js'
import type { DefinitionEventBridgeConfig } from '../DefinitionEventBridgeConfig.js'
import type { InvokeList } from '../InvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
import type { StreamDefinitionMetadataBase } from './StreamDefinitionMetadataBase.js'
import type { StreamFunction } from './StreamFunction.js'

export type StreamDefinition<
	S extends ServiceClass,
	MessagePayloadType,
	MessageParamsType,
	FunctionPayloadType,
	FunctionParamsType,
	ChunkType,
	FinalType,
	Resources extends Record<string, unknown>,
	Invokes extends InvokeList,
	StreamInvokes extends StreamInvokeList,
	EmitList extends Record<string, Schema>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	MetadataType extends StreamDefinitionMetadataBase = StreamDefinitionMetadataBase,
> = {
	streamName: string
	streamDescription: string
	metadata: MetadataType
	eventBridgeConfig: DefinitionEventBridgeConfig
	chunkSchema?: Schema
	finalSchema?: Schema
	call: StreamFunction<
		S,
		MessagePayloadType,
		MessageParamsType,
		FunctionPayloadType,
		FunctionParamsType,
		ChunkType,
		FinalType,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		QueueInvokes
	>
	finalEventName?: string
	chunkValidationEnabled: boolean
	finalValidationEnabled: boolean
	aggregateChunks: boolean
	invokes: Invokes
	streamInvokes: StreamInvokes
	emitList: EmitList
	queueInvokes: QueueInvokes
}
