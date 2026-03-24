import { describe, expect, it } from 'vitest'

import { extractAgentErrorMessage, extractArtifactJson, extractFinalAssistantText, toFrameRecord } from './extract.js'

describe('protocol extract helpers', () => {
	it('returns null for missing or invalid frames', () => {
		expect(toFrameRecord(undefined)).toBeNull()
		expect(toFrameRecord({ frame: null } as never)).toBeNull()
		expect(toFrameRecord({ frame: 'text' } as never)).toBeNull()
	})

	it('extracts final assistant text from streamed and final frames', () => {
		expect(
			extractFinalAssistantText([
				{
					frame: { kind: 'message', role: 'assistant', content: 'Hello ' },
				},
				{
					frame: {
						kind: 'message',
						role: 'assistant',
						content: 'Hello world',
						final: true,
					},
				},
			] as never),
		).toBe('Hello world')
		expect(
			extractFinalAssistantText([
				{
					frame: { kind: 'message', role: 'assistant', content: 'Hello ' },
				},
				{
					frame: {
						kind: 'message',
						role: 'assistant',
						content: 'world',
						final: true,
					},
				},
			] as never),
		).toBe('Hello world')
		expect(extractFinalAssistantText([])).toBe('')
	})

	it('extracts the last error message with sensible fallback', () => {
		expect(
			extractAgentErrorMessage([
				{ frame: { kind: 'error', message: 'first' } },
				{ frame: { kind: 'error', code: 'E_LAST' } },
			] as never),
		).toBe('E_LAST')
		expect(extractAgentErrorMessage([{ frame: { kind: 'error' } }] as never)).toBe('Sub-agent execution failed.')
		expect(extractAgentErrorMessage([])).toBe('')
	})

	it('extracts artifact json from string and object-valued artifact frames', () => {
		expect(
			extractArtifactJson<{ ok: boolean }>(
				[
					{
						frame: {
							kind: 'artifact',
							artifactId: 'deliverable:test',
							content: '{"ok":true}',
						},
					},
				] as never,
				'deliverable:test',
			),
		).toEqual({ ok: true })

		expect(
			extractArtifactJson<{ ok: boolean }>(
				[
					{
						frame: {
							kind: 'artifact',
							artifactId: 'deliverable:test',
							content: { ok: true },
						},
					},
				] as never,
				'deliverable:test',
			),
		).toEqual({ ok: true })
	})
})
