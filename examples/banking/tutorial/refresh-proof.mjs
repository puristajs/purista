#!/usr/bin/env node
import assert from 'node:assert/strict'
import { readFile, writeFile, rename } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
	actionRecords,
	assertServiceBoundaries,
	chapters,
	digest,
	enforcesV4Source,
	pagesFor,
	releaseMetadataArtifactNames,
	readTrackedFreshReplayProof,
	retainedRoot,
	sequence,
	sourceHashes,
	writeTarget,
	relativeTarget,
} from './tutorial-contract.mjs'

const { values } = parseArgs({ options: { chapter: { type: 'string' } } })
assert(values.chapter, 'Use --chapter <id>')
assert(chapters.has(values.chapter), `Unknown chapter: ${values.chapter}`)

function normalizeAction(action) {
	if (action.write) return { page: action.page, write: action.write }
	if (action.server) return { page: action.page, server: action.server }
	if (action.command && action.replay === 'server') return { page: action.page, server: action.command }
	if (action.command) return { page: action.page, command: action.command }
	if (action.responseChecked) return { page: action.page, responseChecked: true }
	if (action.expect) return { page: action.page, responseChecked: true, expect: action.expect, body: action.body }
	return action
}

function pageActions(actions, page) {
	return actions.filter(action => action.page === page).map(normalizeAction)
}

function isLocalExportScriptReplacement(oldAction, nextAction, scripts) {
	if (oldAction.page !== nextAction.page || oldAction.command === undefined || nextAction.command === undefined) return false
	const oldCommand = oldAction.command.trim().replace(/\\\n\s*/g, ' ').replace(/\s+/g, ' ')
	const nextCommand = nextAction.command.trim().replace(/\s+/g, ' ')
	const scriptName = nextCommand.match(/^npm run ([a-zA-Z0-9:_-]+)$/)?.[1]
	if (!scriptName || !oldCommand.startsWith('npx purista export runtime-capabilities ')) return false
	return scripts[scriptName]?.startsWith('purista export runtime-capabilities') === true
}

function changedOnlyAllowedInstall(oldActions, newActions, scripts) {
	if (oldActions.length !== newActions.length) return false
	return oldActions.every((oldAction, index) => {
		const next = newActions[index]
		if (JSON.stringify(oldAction) === JSON.stringify(next)) return true
		if (oldAction.responseChecked && next.responseChecked) return oldAction.expect === undefined || oldAction.expect === next.expect && oldAction.body === next.body
		if (isLocalExportScriptReplacement(oldAction, next, scripts)) return true
		return oldAction.page === next.page && oldAction.command !== undefined && next.command !== undefined &&
			/^(?:npm\s+(?:install|i|create)|npx\s+(?:--yes\s+)?(?:--package(?:=|\s+)))/.test(next.command)
	})
}

const pending = []
const generatedScaffoldTargets = new Set(['AGENTS.md', '.agents/IMPLEMENTATION.md', 'purista.json'])
for (const chapter of sequence(values.chapter)) {
	const root = retainedRoot(chapter.id)
	const { proof, source: freshProofSource } = await readTrackedFreshReplayProof(chapter.id)
	const scripts = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')).scripts ?? {}
	const allPages = await pagesFor(chapter.id)
	const pages = allPages.filter(page => page.chapter.id === chapter.id)
	const actions = actionRecords(allPages)
	const ownActions = actionRecords(pages)
	const finalWrites = new Map()
	for (const page of allPages) {
		const pageTargets = new Set()
		for (const block of page.blocks) {
			if (block.replay) {
				for (const line of block.body.trim().split('\n')) {
					const removed = line.trim().match(/^rm ((?:[^\s]+\s*)+)$/)?.[1]?.trim().split(/\s+/) ?? []
					for (const target of removed) {
						relativeTarget(root, target)
						finalWrites.delete(target)
					}
				}
			}
			const target = writeTarget(block)
			if (!target) continue
			assert(!pageTargets.has(target), `${page.id}: duplicate write target ${target}`)
			pageTargets.add(target)
			finalWrites.set(target, { page: page.id, chapterId: page.chapter.id, body: block.body })
		}
	}
	for (const [target, write] of finalWrites) {
		const destination = relativeTarget(root, target)
		const retained = await readFile(destination, 'utf8')
		assert.equal(write.body.trimEnd(), retained.trimEnd(), `${chapter.id}: final write fence does not match retained ${target}`)
	}
	const writeTargets = new Set(finalWrites.keys())
	for (const required of chapter.requiredWrittenFiles ?? []) {
		assert(writeTargets.has(required), `${chapter.id}: requiredWrittenFiles is missing a complete write fence for ${required}`)
	}
	await assertServiceBoundaries(root, enforcesV4Source(chapter))

	const oldFiles = Object.fromEntries(Object.entries(proof.files).filter(([path]) => !releaseMetadataArtifactNames.has(path)))
	const currentFiles = await sourceHashes(root, enforcesV4Source(chapter))
	for (const path of new Set([...Object.keys(oldFiles), ...Object.keys(currentFiles)])) {
		if (oldFiles[path] === currentFiles[path]) continue
		assert(writeTargets.has(path) || generatedScaffoldTargets.has(path), `${chapter.id}: source hash changed outside a current write target or generated scaffold file: ${path}`)
	}

	for (const page of pages) {
		if (!Object.hasOwn(proof.pages, page.id)) continue
		if (proof.pages[page.id] === digest(page.source)) continue
		const old = pageActions(proof.actions, page.id)
		const next = pageActions(actions, page.id)
		assert(changedOnlyAllowedInstall(old, next, scripts), `${chapter.id}: page changed without a write or approved command action: ${page.id}`)
	}

	pending.push({
		path: join(root, '.tutorial-alignment-proof.json'),
		proof: {
			proofVersion: 1,
			kind: 'retained-alignment',
			freshReplay: false,
			chapter: chapter.id,
			baseFreshProofDigest: digest(freshProofSource),
			packageManifestDigest: digest(await readFile(join(root, 'package.json'))),
			pages: Object.fromEntries(allPages.filter(page => !page.hasPackageWrite).map(page => [page.id, digest(page.source)])),
			files: currentFiles,
			actions: ownActions.map(normalizeAction),
			writeTargets: [...writeTargets].sort(),
		},
	})
}

for (const item of pending) {
	const temporary = `${item.path}.tmp-${process.pid}`
	await writeFile(temporary, `${JSON.stringify(item.proof, null, 2)}\n`)
	await rename(temporary, item.path)
}
process.stdout.write(`Wrote retained-alignment proof for ${pending.length} recipe(s); no replay commands were executed.\n`)
