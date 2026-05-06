import type { Schema } from '../../../schema/index.js'
import type { DefinitionEventBridgeConfig } from '../DefinitionEventBridgeConfig.js'
import type { EBMessageType } from '../EBMessageType.enum.js'
import type { InstanceId } from '../InstanceId.js'
import type { InvokeList } from '../InvokeList.js'
import type { PrincipalId } from '../PrincipalId.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { TenantId } from '../TenantId.js'
import type { SubscriptionAfterGuardHook } from './SubscriptionAfterGuardHook.js'
import type { SubscriptionBeforeGuardHook } from './SubscriptionBeforeGuardHook.js'
import type { SubscriptionDefinitionMetadataBase } from './SubscriptionDefinitionMetadataBase.js'
import type { SubscriptionFunction } from './SubscriptionFunction.js'
import type { SubscriptionTransformInputHook } from './SubscriptionTransformInputHook.js'
import type { SubscriptionTransformOutputHook } from './SubscriptionTransformOutputHook.js'

/**
 * The definition for a subscription provided by some service.
 *
 * @group Subscription
 */
export type SubscriptionDefinition<
	S extends ServiceClass,
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
	MetadataType extends SubscriptionDefinitionMetadataBase = SubscriptionDefinitionMetadataBase,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
> = {
	/** the name of the subscription */
	subscriptionName: string
	/** the description of the subscription */
	subscriptionDescription: string
	/** the metadata of the subscription */
	metadata: MetadataType
	/** config information for event bridge */
	eventBridgeConfig: DefinitionEventBridgeConfig
	/** the subscription function */
	call: SubscriptionFunction<
		S,
		FunctionPayloadType,
		FunctionParamsType,
		FunctionOutputType,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		QueueInvokes
	>
	/** filter for messages produced by given sender */
	sender?: {
		serviceName?: string
		serviceVersion?: string
		serviceTarget?: string
		instanceId?: InstanceId
	}
	/** filter for messages consumed by given receiver */
	receiver?: {
		serviceName?: string
		serviceVersion?: string
		serviceTarget?: string
		instanceId?: InstanceId
	}
	/** filter for message type */
	messageType?: EBMessageType
	/** filter forevent name */
	eventName?: string
	/** event name to be used for custom message if the subscription functions returns value  */
	emitEventName?: string
	/** filter for principal id */
	principalId?: PrincipalId
	/** filter for tenant id */
	tenantId?: TenantId
	/** hooks of subscription */
	hooks: {
		transformInput?: {
			transformInputSchema: Schema
			transformParameterSchema: Schema
			transformFunction: SubscriptionTransformInputHook<
				S,
				TransformInputPayload,
				TransformInputParams,
				FunctionPayloadType,
				FunctionParamsType
			>
		}
		beforeGuard?: Record<
			string,
			SubscriptionBeforeGuardHook<
				S,
				FunctionPayloadType,
				FunctionParamsType,
				Resources,
				Invokes,
				StreamInvokes,
				EmitList,
				QueueInvokes
			>
		>
		afterGuard?: Record<
			string,
			SubscriptionAfterGuardHook<
				S,
				FunctionPayloadType,
				FunctionParamsType,
				FunctionOutputType,
				Resources,
				Invokes,
				StreamInvokes,
				EmitList,
				QueueInvokes
			>
		>
		transformOutput?: {
			transformOutputSchema: Schema
			transformFunction: SubscriptionTransformOutputHook<
				S,
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
	deprecated: boolean
}
