import { openai } from '@purista/harness-openai'

export const createOpenAiIncidentModel = () => {
	const apiKey = process.env.OPENAI_API_KEY
	if (!apiKey) {
		throw new Error('Missing OPENAI_API_KEY. Copy .env.example to .env and set the key before starting the example.')
	}

	return openai({ apiKey })
}
