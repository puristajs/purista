import { type BuilderState, defineHarnessModule, type HostToolDefinition, type ModelAlias } from '@purista/harness'

import {
	type supportV1IncidentIdPayloadSchema,
	type supportV1IncidentSnapshotSchema,
	supportV1SignalAnalysisInputPayloadSchema,
	supportV1SignalAnalysisOutputPayloadSchema,
} from '../../../service/support/v1/schema.js'

type AnalyzeSignalsState = BuilderState & {
	models: { primary: ModelAlias }
	tools: {
		get_incident_snapshot: HostToolDefinition<
			typeof supportV1IncidentIdPayloadSchema,
			typeof supportV1IncidentSnapshotSchema
		>
	}
}

/** Uses a service-owned host tool to analyze trusted incident evidence. */
export const analyzeSignalsAgent = defineHarnessModule<AnalyzeSignalsState>()('support.agent.analyze-signals', {
	version: '1.0.0',
	register(builder) {
		return builder.agent('analyze_signals', {
			model: 'primary',
			input: supportV1SignalAnalysisInputPayloadSchema,
			output: supportV1SignalAnalysisOutputPayloadSchema,
			updates: 'object-snapshot',
			tools: ['get_incident_snapshot'],
			instructions:
				'Call get_incident_snapshot for the supplied incident id. Use only that evidence to rank a root-cause hypothesis and propose the next diagnostics.',
		})
	},
})
