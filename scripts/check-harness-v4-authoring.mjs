#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const scriptRoot = dirname(fileURLToPath(import.meta.url))
export const repositoryRoot = resolve(scriptRoot, '..')
export const workspaceRoot = resolve(repositoryRoot, '..')

export const inspectedExtensions = new Set([
	'.js',
	'.mjs',
	'.cjs',
	'.ts',
	'.tsx',
	'.json',
	'.md',
	'.mdx',
	'.yaml',
	'.yml',
])
export const ignoredDirectoryNames = new Set(['node_modules', 'dist', 'coverage', '.git'])
export const removedNames = new Set([
	'defineHarnessModule',
	'HarnessModuleBuilder',
	'BuilderState',
	'getHarnessHostToolBuilder',
	'AgentQueueBuilder',
	'commandAsHarnessTool',
	'HarnessModule',
])

const scanRoots = [
	join(repositoryRoot, 'packages'),
	join(repositoryRoot, 'examples'),
	join(repositoryRoot, 'web/src/content'),
	join(repositoryRoot, 'skills'),
	join(workspaceRoot, 'starter'),
	join(workspaceRoot, 'create-purista'),
	join(workspaceRoot, 'ai-harness/packages'),
	join(workspaceRoot, 'ai-harness/examples'),
	join(workspaceRoot, 'ai-harness/specs'),
]
const aiHarnessRoot = join(workspaceRoot, 'ai-harness')

const migrationBefore = `${sep}web${sep}src${sep}content${sep}migration${sep}`
const negativeFixture = `${sep}ai-harness${sep}packages${sep}harness${sep}type-tests${sep}removed-v3-api.ts`

function relativeName(file) {
	return relative(workspaceRoot, file).split(sep).join('/')
}

export function isExcluded(file) {
	const normalized = file.split(sep).join(sep)
	return `${sep}${normalized}${sep}`.includes(migrationBefore) || normalized.endsWith(negativeFixture)
}

export function isContained(root, file) {
	const parent = resolve(root)
	const child = resolve(file)
	return child === parent || child.startsWith(`${parent}${sep}`)
}

export async function collectFiles(root) {
	const result = []
	let entries
	try {
		entries = await readdir(root, { withFileTypes: true })
	} catch {
		return result
	}
	for (const entry of entries) {
		if (ignoredDirectoryNames.has(entry.name)) continue
		const file = join(root, entry.name)
		if (entry.isSymbolicLink() || !isContained(root, file)) continue
		if (entry.isDirectory()) result.push(...(await collectFiles(file)))
		else if (inspectedExtensions.has(extname(entry.name)) && !isExcluded(file)) result.push(file)
	}
	return result
}

export async function filesToScan() {
	const files = (await Promise.all(scanRoots.map(collectFiles))).flat()
	let rootEntries = []
	try {
		rootEntries = await readdir(aiHarnessRoot, { withFileTypes: true })
	} catch {
		rootEntries = []
	}
	for (const entry of rootEntries) {
		if (!entry.isSymbolicLink() && entry.isFile() && extname(entry.name) === '.md') {
			const file = join(aiHarnessRoot, entry.name)
			if (!isExcluded(file)) files.push(file)
		}
	}
	return [...new Set(files)].sort()
}

function lineAt(source, position) {
	return source.slice(0, position).split('\n').length
}

function finding(file, source, node, rule, detail) {
	return { file: relativeName(file), line: lineAt(source, node?.getStart?.() ?? 0), rule, detail }
}

function propertyName(node) {
	return node?.name?.getText?.().replace(/["']/g, '')
}

function hasDirectProperty(node, name) {
	return (
		ts.isObjectLiteralExpression(node) &&
		node.properties.some(property => {
			return (
				(ts.isPropertyAssignment(property) ||
					ts.isMethodDeclaration(property) ||
					ts.isGetAccessorDeclaration(property) ||
					ts.isSetAccessorDeclaration(property) ||
					ts.isShorthandPropertyAssignment(property)) &&
				propertyName(property) === name
			)
		})
	)
}

function directPropertyInitializer(node, name) {
	if (!ts.isObjectLiteralExpression(node)) return undefined
	for (const property of node.properties) {
		if (ts.isPropertyAssignment(property) && propertyName(property) === name) return property.initializer
	}
	return undefined
}

function hasPropertyWithin(node, name) {
	if (hasDirectProperty(node, name)) return true
	let found = false
	ts.forEachChild(node, child => {
		if (!found && hasPropertyWithin(child, name)) found = true
	})
	return found
}

function hasExpectErrorComment(source, node) {
	const comments = ts.getLeadingCommentRanges(source, node.getFullStart()) ?? []
	return comments.some(comment => /@ts-expect-error\b/.test(source.slice(comment.pos, comment.end)))
}

function hasExpectErrorAnnotation(source, node) {
	let current = node
	while (current && !ts.isSourceFile(current)) {
		if (hasExpectErrorComment(source, current)) return true
		if (ts.isStatement(current)) break
		current = current.parent
	}
	return false
}

function isNativeHarnessSurface(file) {
	const name = relativeName(file)
	return (
		name.startsWith('purista/web/src/content/handbook/harness/') ||
		name.startsWith('purista/web/src/content/handbook-cards/harness/') ||
		name.startsWith('ai-harness/examples/')
	)
}

function isDefineHarnessChain(node) {
	let current = node
	while (current) {
		if (ts.isCallExpression(current)) {
			const expression = current.expression
			if (ts.isIdentifier(expression) && expression.text === 'defineHarness') return true
			if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression))
				current = expression.expression
			else current = expression
		} else if (ts.isPropertyAccessExpression(current) || ts.isElementAccessExpression(current))
			current = current.expression
		else break
	}
	return false
}

function astFindings(file, source) {
	if (!/\.(?:[cm]?[jt]sx?)$/.test(file)) return []
	const scriptKind = /\.tsx?$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.JS
	const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind)
	const results = []
	function visit(node) {
		if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
			const clause = ts.isImportDeclaration(node) ? node.importClause : node.exportClause
			if (clause) {
				const text = clause.getText(tree)
				for (const name of removedNames)
					if (new RegExp(`\\b${name}\\b`).test(text))
						results.push(finding(file, source, node, 'removed-import-export', name))
			}
		}
		if (ts.isExportAssignment(node)) {
			const expression = node.expression.getText(tree)
			for (const name of removedNames)
				if (new RegExp(`\\b${name}\\b`).test(expression))
					results.push(finding(file, source, node, 'removed-import-export', name))
		}
		if (
			ts.isVariableStatement(node) &&
			node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)
		) {
			for (const declaration of node.declarationList.declarations)
				if (ts.isIdentifier(declaration.name) && removedNames.has(declaration.name.text))
					results.push(finding(file, source, declaration, 'removed-import-export', declaration.name.text))
		}
		if (
			(ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) &&
			node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) &&
			node.name &&
			removedNames.has(node.name.text)
		)
			results.push(finding(file, source, node, 'removed-import-export', node.name.text))
		if (ts.isCallExpression(node)) {
			const expression = node.expression
			const callee = ts.isIdentifier(expression) ? expression.text : propertyName(expression)
			if (
				callee === 'defineAgent' &&
				node.arguments.some(
					argument => ts.isObjectLiteralExpression(argument) && hasDirectProperty(argument, 'handler'),
				) &&
				!hasExpectErrorAnnotation(source, node)
			)
				results.push(finding(file, source, node, 'custom-agent-handler', 'defineAgent handler property'))
			if (
				callee === 'defineAgent' &&
				node.arguments[1] &&
				ts.isObjectLiteralExpression(node.arguments[1]) &&
				!hasDirectProperty(node.arguments[1], 'model') &&
				!hasExpectErrorAnnotation(source, node)
			)
				results.push(finding(file, source, node, 'missing-agent-model', 'defineAgent requires an explicit model alias'))
			if (callee === 'getInstance' && !hasExpectErrorAnnotation(source, node)) {
				for (const argument of node.arguments) {
					if (!ts.isObjectLiteralExpression(argument)) continue
					if (
						hasDirectProperty(argument, 'model') &&
						(source.includes('@purista/harness') || source.includes('defineHarness'))
					)
						results.push(finding(file, source, argument, 'singular-harness-model', 'use the exact models alias map'))
					const ai = directPropertyInitializer(argument, 'ai')
					if (ai && ts.isObjectLiteralExpression(ai) && hasDirectProperty(ai, 'model'))
						results.push(finding(file, source, ai, 'singular-harness-model', 'use ai.models with exact aliases'))
				}
			}
			if (
				callee === 'mountHarness' &&
				node.arguments
					.slice(1)
					.some(argument => ts.isObjectLiteralExpression(argument) && hasPropertyWithin(argument, 'publish'))
			)
				results.push(finding(file, source, node, 'mounted-target-publish', 'mountHarness publish property'))
			if (callee === 'addTool' || callee === 'addSkill' || callee === 'addMcpServer')
				results.push(finding(file, source, node, 'removed-registry-api', `.${callee}()`))
			if ((callee === 'define' || callee === 'build') && isDefineHarnessChain(expression))
				results.push(finding(file, source, node, 'terminal-harness-builder', `defineHarness chain .${callee}()`))
			if ((callee === 'canInvokeAgent' || callee === 'canInvokeWorkflow') && node.arguments.length >= 4)
				results.push(finding(file, source, node, 'legacy-invocation-arity', `${callee} has four or more arguments`))
		}
		ts.forEachChild(node, visit)
	}
	visit(tree)
	return results
}

const proseRules = [
	[
		'removed-name',
		/\b(?:defineHarnessModule|HarnessModuleBuilder|BuilderState|getHarnessHostToolBuilder|AgentQueueBuilder|commandAsHarnessTool|HarnessModule)\b/,
		'removed authoring identifier',
	],
	[
		'top-level-harness-layout',
		/(?:^|[^A-Za-z0-9_-])src\/(?:harness|agents)(?=$|[^A-Za-z0-9_-])/,
		'removed top-level Harness layout',
	],
	['removed-registry-api', /\.(?:addTool|addSkill|addMcpServer)\s*\(/, 'removed mutable Harness registry API'],
	[
		'manual-host-tool-bindings',
		/\b(?:const|let|var)\s+(?:hostToolBindings|manualHostToolBindings|toolBindings)\s*=/,
		'manual host-tool binding map',
	],
	[
		'direct-target-execution',
		/\b(?:mountedTarget|localTarget|target)\.(?:run|invoke)\s*\(/,
		'direct local target execution',
	],
	['mounted-target-publish', /\bpublish\s*:/, 'mounted target publish policy'],
]

function fencedInvocationFindings(file, body, openingLine, info) {
	if (!/^(?:[ \t]*)(?:ts|tsx|js|jsx|typescript|javascript)(?:\s|$)/i.test(info.trim())) return []
	const scriptKind = /tsx/i.test(info)
		? ts.ScriptKind.TSX
		: /jsx/i.test(info)
			? ts.ScriptKind.JSX
			: /typescript|\bts\b/i.test(info)
				? ts.ScriptKind.TS
				: ts.ScriptKind.JS
	const tree = ts.createSourceFile(file, body, ts.ScriptTarget.Latest, true, scriptKind)
	const results = []
	function visit(node) {
		if (ts.isCallExpression(node)) {
			const expression = node.expression
			const callee = ts.isIdentifier(expression) ? expression.text : propertyName(expression)
			if (
				callee === 'defineAgent' &&
				node.arguments[1] &&
				ts.isObjectLiteralExpression(node.arguments[1]) &&
				!hasDirectProperty(node.arguments[1], 'model') &&
				!hasExpectErrorAnnotation(body, node)
			) {
				results.push({
					file: relativeName(file),
					line: openingLine + lineAt(body, node.getStart()),
					rule: 'missing-agent-model',
					detail: 'defineAgent requires an explicit model alias',
				})
			}
			if (callee === 'getInstance' && !hasExpectErrorAnnotation(body, node)) {
				for (const argument of node.arguments) {
					if (!ts.isObjectLiteralExpression(argument)) continue
					if (hasDirectProperty(argument, 'model')) {
						results.push({
							file: relativeName(file),
							line: openingLine + lineAt(body, argument.getStart()),
							rule: 'singular-harness-model',
							detail: 'use the exact models alias map',
						})
					}
					const ai = directPropertyInitializer(argument, 'ai')
					if (ai && ts.isObjectLiteralExpression(ai) && hasDirectProperty(ai, 'model')) {
						results.push({
							file: relativeName(file),
							line: openingLine + lineAt(body, ai.getStart()),
							rule: 'singular-harness-model',
							detail: 'use ai.models with exact aliases',
						})
					}
				}
			}
		}
		if (
			ts.isCallExpression(node) &&
			ts.isPropertyAccessExpression(node.expression) &&
			(node.expression.name.text === 'canInvokeAgent' || node.expression.name.text === 'canInvokeWorkflow') &&
			node.arguments.length >= 4
		) {
			results.push({
				file: relativeName(file),
				line: openingLine + lineAt(body, node.getStart()),
				rule: 'legacy-invocation-arity',
				detail: `${node.expression.name.text} has four or more arguments`,
			})
		}
		ts.forEachChild(node, visit)
	}
	visit(tree)
	return results
}

function fencedFindings(file, source) {
	const results = []
	const lines = source.split('\n')
	for (let index = 0; index < lines.length; index += 1) {
		const opening = lines[index].match(/^[ \t]{0,3}(`{3,}|~{3,})([^\n]*?)\r?$/)
		if (!opening) continue
		const delimiter = opening[1][0]
		const length = opening[1].length
		let end = -1
		for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
			const closing = lines[cursor].match(/^[ \t]{0,3}(`{3,}|~{3,})[ \t]*\r?$/)
			if (closing && closing[1][0] === delimiter && closing[1].length >= length) {
				end = cursor
				break
			}
		}
		if (end < 0) continue
		const body = lines.slice(index + 1, end).join('\n')
		for (const [rule, pattern, detail] of proseRules) {
			if (rule === 'top-level-harness-layout' && isNativeHarnessSurface(file)) continue
			const haystack = `${opening[2]}\n${body}`
			if (pattern.test(haystack)) results.push({ file: relativeName(file), line: index + 1, rule, detail })
		}
		results.push(...fencedInvocationFindings(file, body, index + 1, opening[2]))
		index = end
	}
	return results
}

export function auditSource(file, source) {
	if (isExcluded(file)) return []
	return [...astFindings(file, source), ...fencedFindings(file, source)]
}

export async function scanRepository() {
	const findings = []
	for (const file of await filesToScan()) findings.push(...auditSource(file, await readFile(file, 'utf8')))
	return findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const findings = await scanRepository()
	if (findings.length) {
		process.stderr.write(`Harness v4 authoring audit found ${findings.length} violation(s):\n`)
		for (const item of findings) process.stderr.write(`- ${item.file}:${item.line} [${item.rule}] ${item.detail}\n`)
		process.exitCode = 1
	} else {
		process.stdout.write(`Harness v4 authoring audit passed (${(await filesToScan()).length} files scanned).\n`)
	}
}
