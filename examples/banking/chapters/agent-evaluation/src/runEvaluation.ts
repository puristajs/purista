import { openai } from '@purista/harness-openai'
import { assertClassificationGate } from './changeGate.js'
import { runClassificationEvaluation } from './runClassificationEvaluation.js'

async function main() {
	const apiKey = process.env.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to run the evaluation.')
	const model = process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini'
	const result = await runClassificationEvaluation(openai({ apiKey }), { model })
	const gate = assertClassificationGate(result)
	process.stdout.write(`${JSON.stringify({ status: result.status, gate }, null, 2)}\n`)
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Evaluation failed.'}\n`)
	process.exit(1)
})
