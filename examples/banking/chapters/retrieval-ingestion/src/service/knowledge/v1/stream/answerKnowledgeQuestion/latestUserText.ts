import { HandledError, StatusCode } from '@purista/core'
import { aiSdkTextPartSchema } from '../../schema.js'

export function latestUserText(messages: ReadonlyArray<{ role: string; parts: unknown[] }>) {
	const user = [...messages].reverse().find((message) => message.role === 'user')
	if (!user) throw new HandledError(StatusCode.BadRequest, 'A user message is required')
	const text = user.parts
		.map((part) => aiSdkTextPartSchema.safeParse(part))
		.filter((result) => result.success)
		.map((result) => result.data.text)
		.join('\n')
		.trim()
	if (!text) throw new HandledError(StatusCode.BadRequest, 'The user message contains no text')
	return text
}
