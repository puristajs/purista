import { HandledError, type StateStore, StatusCode } from '@purista/core'
import { z } from 'zod'

export const sessionRecordSchema = z.object({
	principalId: z.string().min(1),
	tenantId: z.string().min(1),
	displayName: z.string().min(1),
	expiresAt: z.number().int().positive(),
})

export type SessionRecord = z.infer<typeof sessionRecordSchema>
type SessionStates = Pick<StateStore, 'getState' | 'removeState'>
export const sessionStateKey = (token: string) => `identity:session:${token}`

export async function readActiveSession(states: SessionStates, token: string, now = Date.now()) {
	const key = sessionStateKey(token)
	const values = await states.getState(key)
	const parsed = sessionRecordSchema.safeParse(values[key])
	if (!parsed.success || parsed.data.expiresAt <= now) {
		if (values[key] !== undefined) await states.removeState(key)
		throw new HandledError(StatusCode.Unauthorized, 'Session is missing, invalid, or expired')
	}
	return parsed.data
}
