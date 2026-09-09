import { defineAgent } from '@purista/harness'

import {
	supportV1SignalAnalysisInputPayloadSchema,
	supportV1SignalAnalysisOutputPayloadSchema,
} from '../../../schema.js'
import { getIncidentSnapshotTool } from '../../tool/getIncidentSnapshot/getIncidentSnapshotTool.js'
import { getRunbookTool } from '../../tool/getRunbook/getRunbookTool.js'

/** Uses service-owned host tools to analyze trusted incident evidence. */
export const analyzeSignalsAgent = defineAgent('analyzeSignals', {
	input: supportV1SignalAnalysisInputPayloadSchema,
	output: supportV1SignalAnalysisOutputPayloadSchema,
	tools: [getIncidentSnapshotTool, getRunbookTool],
	instructions:
		'Load the incident snapshot and its service runbook. Use only that evidence to rank a root-cause hypothesis and propose the next diagnostics.',
	prompt: input => ({
		role: 'user',
		content: `Analyze incident ${input.incidentId}${input.focus ? ` with focus: ${input.focus}` : ''}.`,
	}),
})
