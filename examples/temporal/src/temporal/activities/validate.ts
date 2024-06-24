import { StatusCode, UnhandledError } from '@purista/core'
import { z } from 'zod'

export async function validate<T extends z.Schema>(data: unknown): Promise<z.infer<T>> {
	const onboardingWorkflowInputSchema = z.object({
		name: z.string(),
		email: z.string().email().toLowerCase(),
	})

	try {
		return onboardingWorkflowInputSchema.parse(data)
	} catch (err) {
		throw UnhandledError.fromError(err, StatusCode.InternalServerError)
	}
}
