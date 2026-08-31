import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import {
	DefaultEventBridge,
	DefaultQueueBridge,
	gracefulShutdown,
	HandledError,
	initLogger,
	inMemoryMemoryEngine,
	type PuristaMetricsRecorderInterface,
} from '@purista/core'
import type { Sandbox } from '@purista/harness'
import { honoV1Service } from '@purista/hono-http-server'
import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from 'ai'

import { BankingOperationsStore } from './advanced/repository.js'
import { bankingOperationsService } from './advanced/service.js'
import { answerGroundedQuestion } from './knowledge/answer.js'
import { BankingKnowledgeRepository, knowledgeCollectionIds } from './knowledge/repository.js'
import { bankingKnowledgeService } from './knowledge/service.js'
import { bankingSupportMemoryService } from './memory/service.js'
import type { BankActor } from './repository.js'
import { BankingRepository } from './repository.js'
import { FeeChangeReviewStore } from './review/repository.js'
import { bankingFeeChangeReviewService } from './review/service.js'
import { StatementAnalysisStore } from './sandbox/repository.js'
import { bankingStatementAnalysisService } from './sandbox/service.js'
import { bankingService } from './service.js'

const tutorialUiDirectory = fileURLToPath(new URL('../ui/dist', import.meta.url))
const sessionCookieName = 'example_bank_session'
const localTenantId = 'tenant-north' as const
const fixtureActors = ['alice', 'bob', 'carol', 'dana', 'erin'] as const satisfies readonly BankActor[]

type LocalSession = {
	principalId: BankActor
	tenantId: typeof localTenantId
}

type TutorialChatRequest = {
	collectionId?: unknown
	messages?: unknown
}

const extractLatestUserQuestion = (messages: unknown) => {
	if (!Array.isArray(messages)) return undefined
	for (const message of [...messages].reverse()) {
		if (
			typeof message !== 'object' ||
			message === null ||
			(message as { role?: unknown }).role !== 'user' ||
			!Array.isArray((message as { parts?: unknown }).parts)
		) {
			continue
		}
		const question = (message as { parts: Array<{ type?: unknown; text?: unknown }> }).parts
			.filter(part => part.type === 'text' && typeof part.text === 'string')
			.map(part => part.text)
			.join('')
			.trim()
		if (question) return question
	}
	return undefined
}

const isFixtureActor = (value: unknown): value is BankActor =>
	typeof value === 'string' && fixtureActors.includes(value as BankActor)

const isKnowledgeCollectionId = (value: unknown): value is (typeof knowledgeCollectionIds)[number] =>
	typeof value === 'string' && knowledgeCollectionIds.includes(value as (typeof knowledgeCollectionIds)[number])

const readCookie = (cookieHeader: string | undefined, name: string) => {
	if (!cookieHeader) return undefined
	for (const part of cookieHeader.split(';')) {
		const [key, ...value] = part.trim().split('=')
		if (key === name) return value.join('=')
	}
	return undefined
}

const sessionCookie = (sessionId: string) =>
	`${sessionCookieName}=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`

const expiredSessionCookie = `${sessionCookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`

export type BankingApplicationOptions = {
	/** Injects a deterministic repository for a focused runtime test. */
	bankingRepository?: BankingRepository
	/** Captures safe framework and application metrics in a focused runtime test. */
	metricsRecorder?: PuristaMetricsRecorderInterface
	/** Optional real sandbox composition for the statement-analysis tutorial checkpoint. */
	statementSandbox?: Sandbox
}

export const createBankingApplication = async (options: BankingApplicationOptions = {}) => {
	const eventBridge = new DefaultEventBridge()
	const queueBridge = new DefaultQueueBridge()
	const bankingRepository = options.bankingRepository ?? new BankingRepository()
	const operationsStore = new BankingOperationsStore()
	const knowledgeRepository = new BankingKnowledgeRepository()
	const feeChangeReviewStore = new FeeChangeReviewStore()
	const statementAnalysisStore = new StatementAnalysisStore()
	const supportMemoryEngine = inMemoryMemoryEngine()
	const sessions = new Map<string, LocalSession>()
	await eventBridge.start()
	await queueBridge.start()
	const banking = await bankingService.getInstance(eventBridge, {
		resources: { bankingRepository },
		metricsRecorder: options.metricsRecorder,
	})
	const bankingOperations = await bankingOperationsService.getInstance(eventBridge, {
		queueBridge,
		resources: { bankingRepository, operationsStore },
		metricsRecorder: options.metricsRecorder,
	})
	const bankingKnowledge = await bankingKnowledgeService.getInstance(eventBridge, {
		queueBridge,
		resources: { knowledgeRepository },
		ai: { models: {} },
	})
	const bankingFeeChangeReview = await bankingFeeChangeReviewService.getInstance(eventBridge, {
		resources: { bankingRepository, feeChangeReviewStore },
	})
	const bankingSupportMemory = await bankingSupportMemoryService.getInstance(eventBridge, {
		resources: { bankingRepository },
		ai: {
			models: {
				// The deterministic preference workflows never invoke this catalog entry.
				'memory-runtime': {
					provider: { id: 'banking-no-model', genAiSystem: 'tutorial' },
					model: 'not-invoked',
					capabilities: ['object'],
				},
			},
			memory: supportMemoryEngine,
		},
	})
	const bankingStatementAnalysis = options.statementSandbox
		? await bankingStatementAnalysisService.getInstance(eventBridge, {
				queueBridge,
				resources: {
					bankingRepository,
					statementAnalysisStore,
					statementSandbox: options.statementSandbox,
				},
			})
		: undefined
	await banking.start()
	await bankingOperations.start()
	await bankingKnowledge.start()
	await bankingFeeChangeReview.start()
	await bankingSupportMemory.start()
	await bankingStatementAnalysis?.start()

	const hono = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: {
			services: [
				banking,
				bankingOperations,
				bankingKnowledge,
				bankingFeeChangeReview,
				bankingSupportMemory,
				...(bankingStatementAnalysis ? [bankingStatementAnalysis] : []),
			],
			autoRegisterServicesFromConfig: true,
		},
	})
	const findSession = (cookieHeader: string | undefined) => {
		const sessionId = readCookie(cookieHeader, sessionCookieName)
		return sessionId ? sessions.get(sessionId) : undefined
	}

	/**
	 * A local-only fixture login. The browser chooses a documented fixture person,
	 * then receives an opaque HttpOnly session. Protected routes trust only the
	 * server-side session record, never a browser-provided principal header.
	 */
	hono.app.post('/auth/login', async context => {
		const body = await context.req.json<{ actor?: unknown }>().catch(() => undefined)
		if (!isFixtureActor(body?.actor)) return context.json({ title: 'Choose a known tutorial actor' }, 400)

		const sessionId = randomUUID()
		const session = { principalId: body.actor, tenantId: localTenantId } as const
		sessions.set(sessionId, session)
		context.header('set-cookie', sessionCookie(sessionId))
		return context.json(session)
	})
	hono.app.post('/auth/logout', context => {
		const sessionId = readCookie(context.req.header('cookie'), sessionCookieName)
		if (sessionId) sessions.delete(sessionId)
		context.header('set-cookie', expiredSessionCookie)
		return context.body(null, 204)
	})
	hono.app.get('/auth/whoami', context => {
		const session = findSession(context.req.header('cookie'))
		if (!session) return context.json({ title: 'A local session is required' }, 401)
		return context.json(session)
	})
	hono.setProtectMiddleware(async function (context, next) {
		const session = findSession(context.req.header('cookie'))
		if (!session) return context.json({ title: 'A local session is required' }, 401)
		context.set('principalId', session.principalId)
		context.set('tenantId', session.tenantId)
		return next()
	})
	/**
	 * AI SDK UI transport only. It uses the same server-owned retrieval helper as
	 * the PURISTA HTTP command, then streams the deterministic grounded text for
	 * the React chat component. The browser never chooses another person's scope.
	 */
	hono.app.post('/api/chat/knowledge', async context => {
		const session = findSession(context.req.header('cookie'))
		if (!session) return context.json({ title: 'A local session is required' }, 401)
		const body = await context.req.json<TutorialChatRequest>().catch(() => undefined)
		const collectionId = isKnowledgeCollectionId(body?.collectionId) ? body.collectionId : undefined
		const question = extractLatestUserQuestion(body?.messages)
		if (!collectionId || !question) {
			return context.json({ title: 'Choose a collection and ask a question' }, 400)
		}
		try {
			const answer = answerGroundedQuestion(
				knowledgeRepository,
				{ collectionId, question },
				{ tenantId: session.tenantId, principalId: session.principalId },
			)
			const stream = createUIMessageStream<UIMessage>({
				execute: ({ writer }) => {
					writer.write({ type: 'start' })
					writer.write({ type: 'text-start', id: 'grounded-answer' })
					for (const fragment of answer.answer.split(/(?<=\\s)/)) {
						writer.write({ type: 'text-delta', id: 'grounded-answer', delta: fragment })
					}
					writer.write({ type: 'text-end', id: 'grounded-answer' })
					writer.write({ type: 'finish', finishReason: 'stop' })
				},
			})
			return createUIMessageStreamResponse({ stream })
		} catch (error) {
			if (error instanceof HandledError) return context.json({ title: error.message }, 403)
			return context.json({ title: 'The grounded answer could not be prepared' }, 500)
		}
	})
	// The tutorial UI is intentionally public. Generated PURISTA endpoints are
	// protected by the server-validated local session middleware above.
	hono.app.get('/assets/*', serveStatic({ root: tutorialUiDirectory }))
	hono.app.get('/favicon.svg', serveStatic({ root: tutorialUiDirectory }))
	hono.app.get('/', serveStatic({ root: tutorialUiDirectory, path: 'index.html' }))
	await hono.start()
	return {
		fetch: hono.app.fetch,
		destroy: async () => {
			await hono.destroy()
			await bankingStatementAnalysis?.destroy()
			await bankingSupportMemory.destroy()
			await bankingFeeChangeReview.destroy()
			await bankingKnowledge.destroy()
			await bankingOperations.destroy()
			await banking.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		},
	}
}

export const main = async () => {
	const logger = initLogger('info')
	const image = process.env.PURISTA_BANKING_SANDBOX_IMAGE
	const statementSandbox = image
		? await (async () => {
				const packageName = '@purista/harness-sandbox-docker'
				const adapter = (await import(packageName)) as {
					dockerSandbox?: (options: { root: string; image: string; network: 'none' }) => Sandbox
				}
				if (!adapter.dockerSandbox) throw new Error('The Docker sandbox adapter is unavailable')
				return adapter.dockerSandbox({
					root: process.env.PURISTA_BANKING_SANDBOX_ROOT ?? '/tmp/purista-banking-sandboxes',
					image,
					network: 'none',
				})
			})()
		: undefined
	const application = await createBankingApplication({ statementSandbox })
	const listener = serve({ fetch: application.fetch, port: Number(process.env.PORT ?? 3010) })

	gracefulShutdown(logger, [
		{
			name: 'Example Bank HTTP listener',
			destroy: () =>
				new Promise<void>((resolve, reject) => listener.close(error => (error ? reject(error) : resolve()))),
		},
		{ name: 'Example Bank application', destroy: () => application.destroy() },
	])
}

if (import.meta.url === `file://${process.argv[1]}`) main()
