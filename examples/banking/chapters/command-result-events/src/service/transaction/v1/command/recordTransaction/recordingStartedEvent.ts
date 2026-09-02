import { z } from 'zod'

export const recordingStartedEventName = 'transaction.recording.started.v1'

export const recordingStartedEventSchema = z.object({
	accountId: z.string().trim().min(1),
})
