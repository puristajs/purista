import type { Schema } from '@typeschema/main'
import type { SchemaObject } from 'openapi3-ts/oas31'

import type { Service } from '../../Service/index.js'
import type { DefinitionEventBridgeConfig } from '../DefinitionEventBridgeConfig.js'
import type { EBMessageType } from '../EBMessageType.enum.js'
import type { FromEmitToOtherType } from '../FromEmitToOtherType.js'
import type { FromInvokeToOtherType } from '../FromInvokeToOtherType.js'
import type { InstanceId } from '../InstanceId.js'
import type { InvokeList } from '../InvokeList.js'
import type { PrincipalId } from '../PrincipalId.js'
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
	S extends Service,
	TransformInputPayload,
	TransformInputParams,
	FunctionPayloadType,
	FunctionParamsType,
	FunctionOutputType,
	FinalFunctionOutputType,
	TransformOutputHookOutput,
	Resources extends Record<string, any>,
	Invokes extends InvokeList,
	EmitList extends Record<string, Schema>,
	MetadataType extends SubscriptionDefinitionMetadataBase = SubscriptionDefinitionMetadataBase,
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
		EmitList
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
			SubscriptionBeforeGuardHook<S, FunctionPayloadType, FunctionParamsType, Resources, Invokes, EmitList>
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
				EmitList
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
	invokes: FromInvokeToOtherType<
		Invokes,
		{ outputSchema?: SchemaObject; payloadSchema?: SchemaObject; parameterSchema?: SchemaObject }
	>
	emitList: FromEmitToOtherType<EmitList, SchemaObject>
	deprecated: boolean
}
