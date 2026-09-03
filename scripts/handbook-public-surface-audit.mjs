#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const methodKind = 2048
const kindDirectories = new Map([
	[128, 'classes'],
	[256, 'interfaces'],
])

/**
 * Public types whose declared methods form the application-authoring surface
 * of the Framework and Harness handbooks. Adapter implementation classes,
 * inherited methods, error subclasses, and generic logger methods remain in
 * TypeDoc and are deliberately outside this task-oriented coverage gate.
 *
 * Every declared public method of an owner below must have an exact generated
 * member link somewhere in that product's handbook. Because the method list is
 * read from TypeDoc, adding a method to one of these owners creates a failing
 * documentation gate until the handbook explains and links it.
 */
const publicSurfaceOwners = {
	framework: {
		'@purista/core': [
			'CommandDefinitionBuilder',
			'EventBridge',
			'HarnessExecutionStream',
			'HarnessHostToolBuilder',
			'HttpClient',
			'QueueBridge',
			'QueueDefinitionBuilder',
			'QueueWorkerBuilder',
			'RestClient',
			'ScheduleDefinitionBuilder',
			'ServiceBuilder',
			'ServiceClass',
			'StreamDefinitionBuilder',
			'StreamHandle',
			'SubscriptionDefinitionBuilder',
		],
		'@purista/hono-http-server': ['HonoServiceClass'],
	},
	harness: {
		'@purista/harness': [
			'AgentInvoker',
			'ArtifactStore',
			'ChildTaskHandle',
			'ContinuableChildTaskHandle',
			'ConversationHistory',
			'DurableWorkflowContext',
			'Harness',
			'HarnessBuilder',
			'HarnessDefinition',
			'HarnessModuleBuilder',
			'Session',
			'SessionChildTasks',
			'SessionMemory',
			'WorkflowChildTasks',
			'WorkflowContext',
			'WorkflowInvoker',
		],
	},
}

function getMarkdownFiles(directory) {
	if (!existsSync(directory)) return []
	return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) return getMarkdownFiles(path)
		return entry.isFile() && /\.mdx?$/.test(entry.name) ? [path] : []
	})
}

function packageSlug(packageName) {
	return packageName.replace('@', '_').replaceAll('/', '_')
}

function isDeclaredPublicMethod(member) {
	return (
		member?.kind === methodKind && !member.flags?.isPrivate && !member.flags?.isProtected && !member.flags?.isInherited
	)
}

export function auditHandbookPublicSurface(root = process.cwd()) {
	const issues = []
	const apiFile = resolve(root, 'web', 'src', 'generated', 'purista-api.json')
	if (!existsSync(apiFile)) {
		return ['web/src/generated/purista-api.json: generated TypeDoc data is missing; run npm run build:api-docs']
	}

	let api
	try {
		api = JSON.parse(readFileSync(apiFile, 'utf8'))
	} catch (error) {
		return [
			`web/src/generated/purista-api.json: could not parse generated TypeDoc data (${error instanceof Error ? error.message : String(error)})`,
		]
	}

	for (const [product, packages] of Object.entries(publicSurfaceOwners)) {
		const handbookRoot = resolve(root, 'web', 'src', 'content', 'handbook', product)
		const handbookSource = getMarkdownFiles(handbookRoot)
			.map(file => readFileSync(file, 'utf8'))
			.join('\n')

		for (const [packageName, ownerNames] of Object.entries(packages)) {
			const packageNode = api.children?.find(child => child.name === packageName)
			if (!packageNode) {
				issues.push(`TypeDoc package ${packageName} required by the ${product} public-surface audit is missing`)
				continue
			}

			for (const ownerName of ownerNames) {
				const owner = packageNode.children?.find(child => child.name === ownerName)
				if (!owner) {
					issues.push(
						`TypeDoc owner ${packageName}.${ownerName} required by the ${product} public-surface audit is missing`,
					)
					continue
				}

				const kindDirectory = kindDirectories.get(owner.kind)
				if (!kindDirectory) {
					issues.push(
						`TypeDoc owner ${packageName}.${ownerName} has unsupported kind ${String(owner.kind)} in the public-surface audit`,
					)
					continue
				}

				const methods = owner.children?.filter(isDeclaredPublicMethod) ?? []
				if (methods.length === 0) {
					issues.push(`TypeDoc owner ${packageName}.${ownerName} has no declared public methods to audit`)
					continue
				}

				for (const method of methods) {
					const memberLink = `/handbook/api/${kindDirectory}/${packageSlug(packageName)}.${ownerName}/#${method.name.toLowerCase()}`
					if (!handbookSource.includes(memberLink)) {
						issues.push(`${product} handbook is missing exact public API lookup ${memberLink}`)
					}
				}
			}
		}
	}

	return issues
}

function main() {
	const issues = auditHandbookPublicSurface()
	if (issues.length) {
		process.stderr.write(`PURISTA handbook public-surface audit found ${issues.length} issue(s):\n`)
		for (const issue of issues) process.stderr.write(`- ${issue}\n`)
		process.exitCode = 1
		return
	}

	process.stdout.write('PURISTA handbook public-surface audit passed.\n')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main()
}
