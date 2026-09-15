import { HandledError, StatusCode, type StateStore } from '@purista/core'
import { z } from 'zod'

export const sessionRecordSchema = z.object({
	principalId: z.string().min(1),
	tenantId: z.string().min(1),
	displayName: z.string().min(1),
	expiresAt: z.number().int().positive(),
})

export type SessionRecord = z.infer<typeof sessionRecordSchema>

type SessionStates = Pick<StateStore, 'getState' | 'removeState'>

export const sessionStateKey = (sessionToken: string) => `identity:session:${sessionToken}`

export async function readActiveSession(states: SessionStates, sessionToken: string, now = Date.now()) {
	const key = sessionStateKey(sessionToken)
	const values = await states.getState(key)
	const parsed = sessionRecordSchema.safeParse(values[key])

	if (!parsed.success) {
		if (values[key] !== undefined) await states.removeState(key)
		throw new HandledError(StatusCode.Unauthorized, 'Session is missing or invalid')
	}
	if (parsed.data.expiresAt <= now) {
		await states.removeState(key)
		throw new HandledError(StatusCode.Unauthorized, 'Session has expired')
	}
	return parsed.data
}
