import { assertClassificationGate } from './changeGate.js'
import { runClassificationEvaluation } from './runClassificationEvaluation.js'
import { passingEvaluationProvider } from './testing/scriptedClassificationProvider.js'

async function main() {
	const provider = passingEvaluationProvider()
	const result = await runClassificationEvaluation(provider, { model: 'scripted-evaluation-model' })
	const gate = assertClassificationGate(result)
	process.stdout.write(`${JSON.stringify({ status: result.status, gate }, null, 2)}\n`)
	provider.assertExhausted()
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Evaluation failed.'}\n`)
	process.exit(1)
})
