import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'
import process from 'node:process'
import ts from 'typescript'

const sourceExtensions = new Set(['.ts', '.tsx', '.mts', '.cts'])
const ignoredDirectories = new Set(['coverage', 'dist', 'node_modules'])
const comparePaths = (left, right) => (left < right ? -1 : left > right ? 1 : 0)

const isDeclarationFile = filePath => /\.d\.(?:c|m)?ts$/u.test(filePath)

const collectSourceFiles = rootDirectory => {
	const files = []

	const visitDirectory = directory => {
		for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
			comparePaths(left.name, right.name),
		)) {
			const entryPath = join(directory, entry.name)
			if (entry.isDirectory()) {
				if (!ignoredDirectories.has(entry.name)) {
					visitDirectory(entryPath)
				}
				continue
			}

			if (entry.isFile() && sourceExtensions.has(extname(entry.name)) && !isDeclarationFile(entry.name)) {
				files.push(resolve(entryPath))
			}
		}
	}

	visitDirectory(rootDirectory)
	return files.sort(comparePaths)
}

const getScriptKind = filePath => {
	switch (extname(filePath)) {
		case '.tsx':
			return ts.ScriptKind.TSX
		case '.mts':
			return ts.ScriptKind.MTS
		case '.cts':
			return ts.ScriptKind.CTS
		default:
			return ts.ScriptKind.TS
	}
}

const collectModuleSpecifiers = filePath => {
	const sourceFile = ts.createSourceFile(
		filePath,
		readFileSync(filePath, 'utf8'),
		ts.ScriptTarget.Latest,
		false,
		getScriptKind(filePath),
	)
	const specifiers = new Set()

	const addStringLiteral = node => {
		if (node && ts.isStringLiteralLike(node)) {
			specifiers.add(node.text)
		}
	}

	const visit = node => {
		if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
			addStringLiteral(node.moduleSpecifier)
		} else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
			addStringLiteral(node.moduleReference.expression)
		} else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
			addStringLiteral(node.argument.literal)
		} else if (
			ts.isCallExpression(node) &&
			node.arguments.length === 1 &&
			(node.expression.kind === ts.SyntaxKind.ImportKeyword ||
				(ts.isIdentifier(node.expression) && node.expression.text === 'require'))
		) {
			addStringLiteral(node.arguments[0])
		}

		ts.forEachChild(node, visit)
	}

	visit(sourceFile)
	return [...specifiers].sort(comparePaths)
}

const sourceCandidates = (containingFile, specifier) => {
	if (!specifier.startsWith('.') && !isAbsolute(specifier)) {
		return []
	}

	const target = isAbsolute(specifier) ? resolve(specifier) : resolve(dirname(containingFile), specifier)
	const extension = extname(target)

	switch (extension) {
		case '.js':
			return [`${target.slice(0, -3)}.ts`, `${target.slice(0, -3)}.tsx`]
		case '.jsx':
			return [`${target.slice(0, -4)}.tsx`, `${target.slice(0, -4)}.ts`]
		case '.mjs':
			return [`${target.slice(0, -4)}.mts`, `${target.slice(0, -4)}.ts`]
		case '.cjs':
			return [`${target.slice(0, -4)}.cts`, `${target.slice(0, -4)}.ts`]
		case '.ts':
		case '.tsx':
		case '.mts':
		case '.cts':
			return [target]
		default:
			if (extension) {
				return []
			}
			return [
				`${target}.ts`,
				`${target}.tsx`,
				`${target}.mts`,
				`${target}.cts`,
				join(target, 'index.ts'),
				join(target, 'index.tsx'),
				join(target, 'index.mts'),
				join(target, 'index.cts'),
			]
	}
}

const buildGraph = files => {
	const fileSet = new Set(files)
	const graph = new Map()

	for (const file of files) {
		const dependencies = new Set()
		for (const specifier of collectModuleSpecifiers(file)) {
			const dependency = sourceCandidates(file, specifier).find(candidate => fileSet.has(candidate))
			if (dependency) {
				dependencies.add(dependency)
			}
		}
		graph.set(file, [...dependencies].sort(comparePaths))
	}

	return graph
}

const findCycle = graph => {
	const state = new Map()
	const stack = []
	const stackIndex = new Map()

	const visit = file => {
		state.set(file, 'visiting')
		stackIndex.set(file, stack.length)
		stack.push(file)

		for (const dependency of graph.get(file) ?? []) {
			if (state.get(dependency) === 'visiting') {
				return [...stack.slice(stackIndex.get(dependency)), dependency]
			}
			if (!state.has(dependency)) {
				const cycle = visit(dependency)
				if (cycle) {
					return cycle
				}
			}
		}

		stack.pop()
		stackIndex.delete(file)
		state.set(file, 'visited')
		return undefined
	}

	for (const file of graph.keys()) {
		if (!state.has(file)) {
			const cycle = visit(file)
			if (cycle) {
				return cycle
			}
		}
	}

	return undefined
}

const requestedRoots = process.argv.slice(2)
if (requestedRoots.length > 1) {
	process.stderr.write('Usage: node scripts/check-typescript-import-cycles.mjs [source-root]\n')
	process.exitCode = 1
} else {
	const rootDirectory = resolve(requestedRoots[0] ?? 'packages')
	const rootStats = statSync(rootDirectory)
	if (!rootStats.isDirectory()) {
		throw new Error(`TypeScript source root is not a directory: ${rootDirectory}`)
	}

	const files = collectSourceFiles(rootDirectory)
	const cycle = findCycle(buildGraph(files))
	if (cycle) {
		const displayCycle = cycle.map(file => relative(rootDirectory, file)).join(' -> ')
		process.stderr.write(`TypeScript import cycle detected:\n  ${displayCycle}\n`)
		process.exitCode = 1
	} else {
		process.stdout.write(`No TypeScript import cycles found in ${rootDirectory} (${files.length} files)\n`)
	}
}
