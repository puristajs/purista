import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'

import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { EventBridgeCapabilities } from '../core/EventBridge/types/EventBridgeCapabilities.js'
import {
	EventBridgeCommandTransport,
	EventBridgeResponseConfirmationLevel,
} from '../core/EventBridge/types/EventBridgeCommandCapabilities.js'
import { EventBridgeLateResponseHandling } from '../core/EventBridge/types/EventBridgeLateResponseHandling.js'
import { EventBridgeStreamLateFrameHandling } from '../core/EventBridge/types/EventBridgeStreamLateFrameHandling.js'

type EventBridgeCapabilityOverrides = Partial<Omit<EventBridgeCapabilities, 'consumerFailureHandling'>> & {
	consumerFailureHandling?: Partial<EventBridgeCapabilities['consumerFailureHandling']>
}

/**
 * Mocks the eventBridge and stubs the methods
 * @returns EventBridge mocked
 * @group Unit test helper
 */
export const getEventBridgeMock = (
	sandboxOrOptions?: SinonSandbox | { sandbox?: SinonSandbox; capabilities?: EventBridgeCapabilityOverrides },
): { mock: EventBridge; stubs: Record<string, SinonStub> } => {
	const sandbox = sandboxOrOptions && 'stub' in sandboxOrOptions ? sandboxOrOptions : sandboxOrOptions?.sandbox
	const capabilityOverrides =
		sandboxOrOptions && 'stub' in sandboxOrOptions ? undefined : sandboxOrOptions?.capabilities
	const emitMessage = sandbox?.stub() ?? stub()
	const registerCommand = sandbox?.stub() ?? stub()
	const registerSubscription = sandbox?.stub() ?? stub()
	const registerStream = sandbox?.stub() ?? stub()
	const unregisterCommand = sandbox?.stub() ?? stub()
	const unregisterSubscription = sandbox?.stub() ?? stub()
	const unregisterStream = sandbox?.stub() ?? stub()
	const invoke = sandbox?.stub() ?? stub()
	const openStream = sandbox?.stub() ?? stub()
	const start = sandbox?.stub() ?? stub()
	const isReady = sandbox?.stub().resolves(true) ?? stub().resolves(true)
	const isHealthy = sandbox?.stub().resolves(true) ?? stub().resolves(true)
	const destroy = sandbox?.stub().resolves() ?? stub().resolves()
	const getInFlightExecutionCount = sandbox?.stub().returns(0) ?? stub().returns(0)
	const getInFlightExecutionCounts =
		sandbox?.stub().returns({ command: 0, subscription: 0, stream: 0, generic: 0 }) ??
		stub().returns({ command: 0, subscription: 0, stream: 0, generic: 0 })
	const defaultCapabilities: EventBridgeCapabilities = {
		supportsStreams: true,
		durableCommands: false,
		durableSubscriptions: false,
		manualAckSupported: false,
		lateResponseHandling: EventBridgeLateResponseHandling.IgnoreWithWarning,
		gracefulDrainSupported: false,
		nativeDeadLettering: false,
		commandHandling: {
			transport: EventBridgeCommandTransport.InMemory,
			pendingInvocationCancellation: true,
			responseConfirmation: EventBridgeResponseConfirmationLevel.None,
			strictMode: true,
		},
		streamHandling: {
			incrementalDelivery: true,
			consumerCancellation: true,
			gracefulStreamDrain: true,
			aggregatedFinalSupported: true,
			lateFrameHandling: EventBridgeStreamLateFrameHandling.IgnoreWithWarning,
		},
		consumerFailureHandling: {
			boundedRetry: false,
			delayedRetry: false,
			deadLetterTarget: false,
			drop: false,
			stopConsumer: false,
			consumerPauseResume: false,
			bridgeManagedDeadLettering: false,
			nativeDeadLettering: false,
			fatalClassification: false,
			strictMode: true,
		},
	}

	const mock: EventBridge = {
		name: 'EventBridgeMock',
		instanceId: 'mockedInstanceId',
		defaultCommandTimeout: 30000,
		capabilities: {
			...defaultCapabilities,
			...capabilityOverrides,
			consumerFailureHandling: {
				...defaultCapabilities.consumerFailureHandling,
				...capabilityOverrides?.consumerFailureHandling,
			},
		},
		emitMessage,
		registerCommand,
		registerSubscription,
		registerStream,
		unregisterCommand,
		unregisterSubscription,
		unregisterStream,
		invoke,
		openStream,
		start,
		isReady,
		isHealthy,
		destroy,
		getInFlightExecutionCount,
		getInFlightExecutionCounts,
		getPausedSubscriptionConsumers: sandbox?.stub().returns({}) ?? stub().returns({}),
		resumeSubscriptionConsumer: sandbox?.stub().resolves() ?? stub().resolves(),
	}

	return {
		stubs: {
			emitMessage,
			registerCommand,
			registerSubscription,
			registerStream,
			unregisterCommand,
			unregisterSubscription,
			unregisterStream,
			invoke,
			openStream,
			start,
			isReady,
			isHealthy,
			destroy,
			getInFlightExecutionCount,
			getInFlightExecutionCounts,
			getPausedSubscriptionConsumers: mock.getPausedSubscriptionConsumers as SinonStub,
			resumeSubscriptionConsumer: mock.resumeSubscriptionConsumer as SinonStub,
		},
		mock,
	}
}
