import type { SerializedHarnessTargetExportV1 } from '../../HarnessMount/types.js'

/**
 * A non-callable, JSON-safe view of one mounted Harness composition.
 *
 * The callable target definitions remain in `agents` and `workflows`; this
 * value exists only for architecture inspection and generated-artifact input.
 */
export type MountedHarnessDefinition = Readonly<{
	name: string
	roots: Readonly<{
		agents: readonly string[]
		workflows: readonly string[]
	}>
	dependencies: Readonly<{
		tools: readonly string[]
		skills: readonly string[]
		mcpServers: readonly string[]
		agents: readonly string[]
		workflows: readonly string[]
	}>
}>

/** JSON-safe callable targets exported by a mounted Harness service. */
export type MountedHarnessTargetDefinitions = Readonly<{
	agents: Readonly<Record<string, SerializedHarnessTargetExportV1>>
	workflows: Readonly<Record<string, SerializedHarnessTargetExportV1>>
	harness: MountedHarnessDefinition
}>
