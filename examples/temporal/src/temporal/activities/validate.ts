import { StatusCode, UnhandledError } from '@purista/core'
import { z } from 'zod/v4'

const onboardingWorkflowInputSchema = z.object({
	name: z.string(),
	email: z.string().email().toLowerCase(),
})

export type OnboardingWorkflowInput = z.infer<typeof onboardingWorkflowInputSchema>

export async function validate(data: unknown): Promise<OnboardingWorkflowInput> {
	try {
		return onboardingWorkflowInputSchema.parse(data)
	} catch (err) {
		throw UnhandledError.fromError(err, StatusCode.InternalServerError)
	}
}
