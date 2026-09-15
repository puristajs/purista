#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

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
			'ArtifactStore',
			'ChildTaskHandle',
			'ContinuableChildTaskHandle',
			'ConversationHistory',
			'DurableWorkflowContext',
			'HarnessInstance',
			'HarnessSession',
			'HarnessTargetInvoker',
			'HarnessTargetStream',
			'SessionChildTasks',
			'SessionMemory',
			'WorkflowChildTasks',
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

const removedHarnessPatterns = [
	[/\bdefineHarnessModule\b/g, 'defineHarnessModule'],
	[/\bHarnessModule\b/g, 'HarnessModule'],
	[/\bHarnessBuilder\b/g, 'HarnessBuilder'],
	[/\bHarnessModuleBuilder\b/g, 'HarnessModuleBuilder'],
	[/\bBuilderState\b/g, 'BuilderState'],
	[/\bAgentQueueBuilder\b/g, 'AgentQueueBuilder'],
	[/\bgetHarnessHostToolBuilder\b/g, 'getHarnessHostToolBuilder'],
	[/\bbuiltinTools\b/g, 'the removed lowercase builtinTools field'],
	[
		/\b(?:harness|runtime|session)(?:\.[A-Za-z_$][\w$]*)*\.(?:shutdown|observe|inspect)\s*\(/g,
		'removed Harness runtime method',
	],
	[
		/^\s*\.(?:logger|telemetry|sandbox|model|models|tool|tools|skill|skills|memory|storage|workspace|agent|agents|workflow|workflows|addTool|addSkill|addMcpServer|define|build)\s*\(/gm,
		'removed fluent Harness builder method',
	],
]

const scriptFenceLanguages = new Set(['js', 'javascript', 'jsx', 'mjs', 'mts', 'ts', 'tsx', 'typescript'])
const forbiddenAgentTopLevelFields = new Map([
	['handler', 'defineAgent does not accept a custom handler'],
	['maxDepth', 'defineAgent loop limits must be nested under loop'],
	['maxParallelSubagents', 'defineAgent loop limits must be nested under loop'],
	['maxSteps', 'defineAgent loop limits must be nested under loop'],
	['maxSubagentCalls', 'defineAgent loop limits must be nested under loop'],
	['maxToolCalls', 'defineAgent loop limits must be nested under loop'],
])

function extractCodeFences(source, relative, issues) {
	const fences = []
	const lines = source.split(/\r?\n/)
	let openFence

	for (const [index, line] of lines.entries()) {
		const match = /^[ \t]*(`{3,}|~{3,})(.*)$/.exec(line)
		if (!match) {
			if (openFence) openFence.lines.push(line)
			continue
		}

		const marker = match[1]
		const info = match[2].trim()
		if (!openFence) {
			if (info === '') {
				issues.push(`${relative}:${index + 1}: unexpected or duplicate closing code fence`)
				continue
			}

			const titleAttributes = info.match(/\btitle\s*=/g) ?? []
			const validTitleAttributes = info.match(/\btitle\s*=\s*(?:"[^"]*"|'[^']*')/g) ?? []
			if (titleAttributes.length > 1) {
				issues.push(`${relative}:${index + 1}: opening code fences must contain at most one title attribute`)
			}
			if (titleAttributes.length !== validTitleAttributes.length) {
				issues.push(`${relative}:${index + 1}: code fence title attributes must use one complete quoted value`)
			}

			openFence = {
				character: marker[0],
				length: marker.length,
				language: info.split(/\s+/, 1)[0].toLowerCase(),
				line: index + 1,
				lines: [],
			}
			continue
		}

		const closesFence = marker[0] === openFence.character && marker.length >= openFence.length && info === ''
		if (closesFence) {
			fences.push({ ...openFence, code: openFence.lines.join('\n') })
			openFence = undefined
			continue
		}

		if (marker[0] === openFence.character && marker.length >= openFence.length && /\btitle\s*=/.test(info)) {
			issues.push(`${relative}:${index + 1}: closing code fences must not contain title attributes`)
		} else if (marker[0] === openFence.character && marker.length >= openFence.length) {
			issues.push(`${relative}:${index + 1}: code fence opens before the previous fence closes`)
		}
		openFence.lines.push(line)
	}

	if (openFence) {
		issues.push(`${relative}:${openFence.line}: code fence is not closed`)
		fences.push({ ...openFence, code: openFence.lines.join('\n') })
	}
	return fences
}

function propertyNameText(name) {
	if (!name) return undefined
	if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text
	if (ts.isComputedPropertyName(name) && ts.isStringLiteral(name.expression)) return name.expression.text
	return undefined
}

function auditDefineAgentOptions(fence, relative, issues) {
	if (!scriptFenceLanguages.has(fence.language)) return

	const scriptKind = fence.language.includes('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
	const sourceFile = ts.createSourceFile(
		`${relative}:${fence.line}`,
		fence.code,
		ts.ScriptTarget.Latest,
		true,
		scriptKind,
	)
	const visit = node => {
		if (
			ts.isCallExpression(node) &&
			ts.isIdentifier(node.expression) &&
			node.expression.text === 'defineAgent' &&
			node.arguments.length >= 2 &&
			ts.isObjectLiteralExpression(node.arguments[1])
		) {
			for (const property of node.arguments[1].properties) {
				const name = propertyNameText(property.name)
				const message = forbiddenAgentTopLevelFields.get(name)
				if (!message) continue

				const location = sourceFile.getLineAndCharacterOfPosition(property.getStart(sourceFile))
				issues.push(`${relative}:${fence.line + location.line + 1}: ${message}`)
			}
		}
		ts.forEachChild(node, visit)
	}
	visit(sourceFile)
}

function auditCurrentHarnessAuthoring(root) {
	const roots = [
		resolve(root, 'web', 'src', 'content', 'handbook', 'harness'),
		resolve(root, 'web', 'src', 'content', 'handbook-cards', 'harness'),
		resolve(root, 'web', 'src', 'content', 'handbook-cards', 'blocks', 'agent-pattern'),
	]
	const files = roots.flatMap(getMarkdownFiles).filter(file => !file.includes(`${join('upgrade-and-migrate', '')}`))
	const issues = []

	for (const file of files) {
		const source = readFileSync(file, 'utf8')
		const relative = file.slice(root.length + 1)
		const fences = extractCodeFences(source, relative, issues)
		for (const fence of fences) auditDefineAgentOptions(fence, relative, issues)
		for (const [pattern, label] of removedHarnessPatterns) {
			pattern.lastIndex = 0
			if (pattern.test(source)) issues.push(`${relative}: current authoring must not use ${label}`)
		}
	}

	return issues
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
	const issues = auditCurrentHarnessAuthoring(root)
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
