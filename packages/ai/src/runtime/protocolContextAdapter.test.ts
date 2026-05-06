import { EBMessageType, type QueueJobContext } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { adaptQueueJobContextToProtocolContext, queueHeaderKeys } from './protocolContextAdapter.js'

describe('protocolContextAdapter', () => {
	it('adapts queue context to protocol context with command message', () => {
		const jobContext = {
			logger: {
				info() {},
				warn() {},
				error() {},
				debug() {},
				trace() {},
				fatal() {},
				getChildLogger() {
					return this
				},
			},
			wrapInSpan: async (_name: string, _opts: unknown, fn: (span: unknown) => Promise<unknown>) => await fn({}),
			startActiveSpan: async (
				_name: string,
				_opts: unknown,
				_context: unknown,
				fn: (span: unknown) => Promise<unknown>,
			) => await fn({}),
			secrets: {
				getSecret: async () => undefined,
				setSecret: async () => undefined,
				removeSecret: async () => undefined,
			},
			configs: {
				getConfig: async () => undefined,
				setConfig: async () => undefined,
				removeConfig: async () => undefined,
			},
			states: { getState: async () => undefined, setState: async () => undefined, removeState: async () => undefined },
			queue: {
				enqueue: async () => ({ messageId: 'id' }),
				enqueueBatch: async () => ({ messages: [] }),
			},
			message: {
				id: 'msg-1',
				queueName: 'agents.queue',
				payload: { hello: 'world' },
				parameter: { locale: 'en' },
				headers: {
					[queueHeaderKeys.principalId]: 'principal-1',
					[queueHeaderKeys.tenantId]: 'tenant-1',
					[queueHeaderKeys.otp]: 'otp-1',
					[queueHeaderKeys.senderServiceName]: 'caller-service',
					[queueHeaderKeys.senderServiceVersion]: '1',
					[queueHeaderKeys.senderServiceTarget]: 'triageAgent',
					[queueHeaderKeys.senderInstanceId]: 'instance-1',
					[queueHeaderKeys.receiverServiceName]: 'supportAgent',
					[queueHeaderKeys.receiverServiceVersion]: '1',
					[queueHeaderKeys.receiverServiceTarget]: 'supportAgent',
				},
				createdAt: Date.now(),
				attempt: 1,
				maxAttempts: 3,
				leaseExpiresAt: Date.now() + 60_000,
				leaseTtlMs: 60_000,
			},
			job: {
				complete: async () => undefined,
				retry: async () => undefined,
				fail: async () => undefined,
				moveToDeadLetter: async () => undefined,
				extendLease: async () => undefined,
			},
			emit: async () => undefined,
			service: {},
			stream: {},
			resources: {},
		} as const

		const context = adaptQueueJobContextToProtocolContext(
			jobContext as unknown as QueueJobContext,
			{ agentName: 'supportAgent', serviceVersion: '1' },
			{ instanceId: 'bridge-1' },
		)

		expect(context.message.messageType).toBe(EBMessageType.Command)
		expect(context.message.principalId).toBe('principal-1')
		expect(context.message.tenantId).toBe('tenant-1')
		expect(context.message.otp).toBe('otp-1')
		expect(context.message.sender.serviceName).toBe('caller-service')
		expect(context.message.receiver.serviceName).toBe('supportAgent')
		expect(context.message.payload.payload).toEqual({ hello: 'world' })
		expect(context.message.payload.parameter).toEqual({ locale: 'en' })
	})
})
