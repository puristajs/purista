import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import type { BuiltinToolName } from '@purista/harness'
import { Node, Project, type SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph'
import type { PuristaCommandResult } from '../../../core/types.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import { getHarnessPaths, type HarnessScaffoldingInput, writeHarnessScaffold } from '../../harnessScaffolding.js'

export type HarnessLeafKind = 'tool' | 'skill' | 'mcp'

export type HarnessLeafFile = Readonly<{
	name: string
	content: string
}>

const definitionFactoryKinds = {
	defineAgent: 'target',
	defineWorkflow: 'target',
	defineTool: 'tool',
	defineSkill: 'skill',
	defineMcpServer: 'mcp',
	getCommandBuilder: 'target',
	getStreamBuilder: 'target',
} as const

const definitionFactories = new Set(Object.keys(definitionFactoryKinds))

const builtInToolNames = Object.freeze({
	bash: true,
	read: true,
	write: true,
	edit: true,
	glob: true,
	grep: true,
	list: true,
} satisfies Readonly<Record<BuiltinToolName, true>>)

/** Refuse canonical Harness built-in ids for custom tools and Skills. */
export const assertNotBuiltInToolName = (id: string, kind: 'tool' | 'Skill') => {
	if (Object.hasOwn(builtInToolNames, id))
		throw new Error(`${kind} id "${id}" collides with a canonical Harness built-in tool; no files were changed.`)
}

const loadSource = (path: string) => {
	const project = new Project({
		useInMemoryFileSystem: true,
		skipFileDependencyResolution: true,
		skipLoadingLibFiles: true,
	})
	const source = project.createSourceFile(path, readFileSync(path, 'utf8'))
	if (source.getPreEmitDiagnostics().some(diagnostic => diagnostic.getCode() >= 1000 && diagnostic.getCode() < 2000))
		throw new Error(`Cannot safely inspect invalid TypeScript in ${path}; no files were changed.`)
	return source
}

/** Require a canonical exported runtime value before a generated value import refers to it. */
export const assertExportedValue = (path: string, identifier: string) => {
	const declaration = loadSource(path).getVariableDeclaration(identifier)
	if (!declaration?.isExported() || !declaration.getInitializer())
		throw new Error(
			`Cannot import ${identifier} from ${path}: no canonical exported value exists; no files were changed.`,
		)
}

const unwrapExpression = (node: Node): Node => {
	if (
		Node.isParenthesizedExpression(node) ||
		Node.isAsExpression(node) ||
		Node.isNonNullExpression(node) ||
		Node.isTypeAssertion(node) ||
		Node.isSatisfiesExpression(node)
	)
		return unwrapExpression(node.getExpression())
	return node
}

const staticString = (node: Node | undefined, source: SourceFile, visited = new Set<Node>()): string | undefined => {
	if (!node) return undefined
	const value = unwrapExpression(node)
	if (visited.has(value)) return undefined
	visited.add(value)
	if (Node.isStringLiteral(value) || Node.isNoSubstitutionTemplateLiteral(value)) return value.getLiteralValue()
	if (!Node.isIdentifier(value)) return undefined
	const declarations = value.getSymbol()?.getDeclarations()
	if (declarations?.length !== 1) return undefined
	const declaration = declarations[0]
	if (!Node.isVariableDeclaration(declaration) || declaration.getSourceFile() !== source) return undefined
	const list = declaration.getParent()
	if (!Node.isVariableDeclarationList(list) || list.getDeclarationKind() !== VariableDeclarationKind.Const)
		return undefined
	return staticString(declaration.getInitializer(), source, visited)
}

const sameFileConstInitializer = (node: Node, source: SourceFile): Node | undefined => {
	if (!Node.isIdentifier(node)) return undefined
	const declarations = node.getSymbol()?.getDeclarations()
	if (declarations?.length !== 1) return undefined
	const declaration = declarations[0]
	if (!Node.isVariableDeclaration(declaration) || declaration.getSourceFile() !== source) return undefined
	const list = declaration.getParent()
	return Node.isVariableDeclarationList(list) && list.getDeclarationKind() === VariableDeclarationKind.Const
		? declaration.getInitializer()
		: undefined
}

const importedName = (node: Node, moduleSpecifier: string) => {
	if (!Node.isIdentifier(node)) return undefined
	const declaration = node
		.getSymbol()
		?.getDeclarations()
		.find(candidate => Node.isImportSpecifier(candidate))
	if (!declaration || !Node.isImportSpecifier(declaration)) return undefined
	return declaration.getImportDeclaration().getModuleSpecifierValue() === moduleSpecifier
		? declaration.getName()
		: undefined
}

const isPuristaServiceBuilderConstructor = (node: Node) => importedName(node, '@purista/core') === 'ServiceBuilder'

const isHarnessNamespaceReference = (expression: Node, source: SourceFile, visited = new Set<Node>()): boolean => {
	const node = unwrapExpression(expression)
	if (visited.has(node)) return false
	visited.add(node)
	if (!Node.isIdentifier(node)) return false
	const initializer = sameFileConstInitializer(node, source)
	if (initializer) return isHarnessNamespaceReference(initializer, source, visited)
	const namespaceImport = node
		.getSymbol()
		?.getDeclarations()
		.find(candidate => Node.isNamespaceImport(candidate))
	return (
		namespaceImport !== undefined &&
		Node.isNamespaceImport(namespaceImport) &&
		namespaceImport.getFirstAncestorByKindOrThrow(SyntaxKind.ImportDeclaration).getModuleSpecifierValue() ===
			'@purista/harness'
	)
}

const isServiceBuilderReference = (expression: Node, source: SourceFile, visited = new Set<Node>()): boolean => {
	const node = unwrapExpression(expression)
	if (visited.has(node)) return false
	visited.add(node)
	if (Node.isNewExpression(node)) return isPuristaServiceBuilderConstructor(node.getExpression())
	if (!Node.isIdentifier(node)) return false
	const initializer = sameFileConstInitializer(node, source)
	if (initializer) return isServiceBuilderReference(initializer, source, visited)
	const imported = node
		.getSymbol()
		?.getDeclarations()
		.find(candidate => Node.isImportSpecifier(candidate))
	if (!imported || !Node.isImportSpecifier(imported)) return false
	const exportedName = imported.getName()
	if (!exportedName.endsWith('ServiceBuilder')) return false
	const moduleSpecifier = imported.getImportDeclaration().getModuleSpecifierValue()
	if (!moduleSpecifier.startsWith('.')) return false
	const definitionFile = resolve(dirname(source.getFilePath()), moduleSpecifier.replace(/\.js$/, '.ts'))
	if (!existsSync(definitionFile))
		throw new Error(
			`Cannot statically prove the ServiceBuilder receiver imported from ${moduleSpecifier} in ${source.getFilePath()}; no files were changed.`,
		)
	const definitionSource = loadSource(definitionFile)
	const definition = definitionSource.getVariableDeclaration(exportedName)
	const definitionInitializer = definition?.getInitializer()
	if (!definition?.isExported() || !definitionInitializer) return false
	return isServiceBuilderReference(definitionInitializer, definitionSource, visited)
}

const factoryName = (expression: Node, source: SourceFile, visited = new Set<Node>()): string | undefined => {
	const node = unwrapExpression(expression)
	if (visited.has(node)) return undefined
	visited.add(node)
	if (Node.isPropertyAccessExpression(node)) {
		const name = node.getName()
		if (isHarnessNamespaceReference(node.getExpression(), source) && definitionFactories.has(name)) return name
		return name === 'defineTool' && isServiceBuilderReference(node.getExpression(), source) ? name : undefined
	}
	if (Node.isElementAccessExpression(node)) {
		const name = staticString(node.getArgumentExpression(), source)
		if (name && isHarnessNamespaceReference(node.getExpression(), source) && definitionFactories.has(name)) return name
		return name === 'defineTool' && isServiceBuilderReference(node.getExpression(), source) ? name : undefined
	}
	if (!Node.isIdentifier(node)) return undefined
	const harnessImport = importedName(node, '@purista/harness')
	if (harnessImport && definitionFactories.has(harnessImport)) return harnessImport
	const initializer = sameFileConstInitializer(node, source)
	return initializer ? factoryName(initializer, source, visited) : undefined
}

const factoryKind = (name: string): HarnessLeafKind | 'target' | undefined => {
	switch (name) {
		case 'defineTool':
			return 'tool'
		case 'defineSkill':
			return 'skill'
		case 'defineMcpServer':
			return 'mcp'
		case 'defineAgent':
		case 'defineWorkflow':
		case 'getCommandBuilder':
		case 'getStreamBuilder':
			return 'target'
		default:
			return undefined
	}
}

const isUninvokedFactoryReference = (node: Node, source: SourceFile, requestedKind: HarnessLeafKind) => {
	if (!Node.isIdentifier(node) && !Node.isPropertyAccessExpression(node) && !Node.isElementAccessExpression(node))
		return false
	if (node.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) return false
	const parent = node.getParent()
	if (Node.isPropertyAccessExpression(parent) && parent.getNameNode() === node) return false
	const name = factoryName(node, source)
	if (!name || factoryKind(name) !== requestedKind) {
		return (
			Node.isElementAccessExpression(node) &&
			staticString(node.getArgumentExpression(), source) === undefined &&
			(isHarnessNamespaceReference(node.getExpression(), source) ||
				(requestedKind === 'tool' && isServiceBuilderReference(node.getExpression(), source)))
		)
	}
	let expression: Node = node
	while (expression.getParent() && unwrapExpression(expression.getParentOrThrow()) === expression)
		expression = expression.getParentOrThrow()
	const call = expression.getParent()
	return !Node.isCallExpression(call) || call.getExpression() !== expression
}

const hasDetachedFactoryReference = (node: Node, source: SourceFile, requestedKind: HarnessLeafKind): boolean => {
	if (Node.isIdentifier(node) || Node.isPropertyAccessExpression(node) || Node.isElementAccessExpression(node))
		return isUninvokedFactoryReference(node, source, requestedKind)
	let key: Node | undefined
	let receiver: Node | undefined
	if (Node.isBindingElement(node) && Node.isObjectBindingPattern(node.getParent())) {
		key = node.getPropertyNameNode() ?? node.getNameNode()
		const declaration = node.getFirstAncestorByKind(SyntaxKind.VariableDeclaration)
		receiver = declaration?.getInitializer()
	} else if (
		Node.isPropertyAssignment(node) ||
		Node.isShorthandPropertyAssignment(node) ||
		Node.isSpreadAssignment(node)
	) {
		const object = node.getParent()
		const assignment = object?.getParent()
		if (
			!Node.isObjectLiteralExpression(object) ||
			!Node.isBinaryExpression(assignment) ||
			assignment.getLeft() !== object ||
			assignment.getOperatorToken().getKind() !== SyntaxKind.EqualsToken
		)
			return false
		key = Node.isSpreadAssignment(node) ? undefined : node.getNameNode()
		receiver = assignment.getRight()
	} else return false
	const name = Node.isIdentifier(key)
		? key.getText()
		: staticString(Node.isComputedPropertyName(key) ? key.getExpression() : key, source)
	const isRest = Node.isBindingElement(node) && node.getDotDotDotToken() !== undefined
	return (
		(receiver !== undefined &&
			isHarnessNamespaceReference(receiver, source) &&
			(name === undefined || factoryKind(name) === requestedKind || isRest)) ||
		(requestedKind === 'tool' &&
			receiver !== undefined &&
			isServiceBuilderReference(receiver, source) &&
			(name === undefined || name === 'defineTool' || isRest))
	)
}

const assertNoDuplicateDefinitionId = (directory: string, id: string, requestedKind: HarnessLeafKind) => {
	if (!existsSync(directory)) return
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) assertNoDuplicateDefinitionId(path, id, requestedKind)
		if (!entry.isFile() || !entry.name.endsWith('.ts') || entry.name.endsWith('.test.ts')) continue
		const source = loadSource(path)
		if (source.getDescendants().some(node => hasDetachedFactoryReference(node, source, requestedKind)))
			throw new Error(
				`Cannot statically prove the definition factory invocation in ${path}. Call the factory directly; no files were changed.`,
			)
		for (const call of source.getDescendantsOfKind(SyntaxKind.CallExpression)) {
			const factory = factoryName(call.getExpression(), source)
			if (!factory || factoryKind(factory) !== requestedKind) continue
			const foundId = staticString(call.getArguments()[0], source)
			if (foundId === undefined)
				throw new Error(
					`Cannot statically prove the ${factory} definition id in ${path}. Use a string literal or a same-file const string alias; no files were changed.`,
				)
			if (foundId === id) throw new Error(`Definition id "${id}" already exists in ${path}. No files were changed.`)
		}
	}
}

const assertInsideProject = (projectPath: string, path: string) => {
	const fromProject = relative(resolve(projectPath), resolve(path))
	if (fromProject === '..' || fromProject.startsWith(`..${sep}`) || isAbsolute(fromProject))
		throw new Error(`Generated path is outside the project: ${path}; no files were changed.`)
}

const assertNoCaseCollision = (parent: string, name: string) => {
	if (!existsSync(parent)) return
	const collision = readdirSync(parent).find(entry => entry.toLocaleLowerCase() === name.toLocaleLowerCase())
	if (collision)
		throw new Error(`Harness leaf directory already exists or differs only by casing: ${join(parent, collision)}`)
}

/** Prepare and validate a leaf-only Harness artifact without changing composition or package metadata. */
export const prepareHarnessLeafScaffold = (
	input: HarnessScaffoldingInput,
	leaf: Readonly<{ kind: HarnessLeafKind; id: string }>,
	directory: Readonly<{ kind: HarnessLeafKind; logicalName: string }>,
	files: readonly HarnessLeafFile[],
) => {
	const paths = getHarnessPaths(input)
	assertInsideProject(paths.projectPath, paths.serviceFile)
	const serviceRoot = dirname(paths.serviceFile)
	const categoryDirectory = join(paths.harnessDirectory, directory.kind)
	const directoryName =
		directory.kind === 'skill'
			? directory.logicalName
			: convertToProjectFileCasing(directory.logicalName, input.puristaConfig)
	assertNoCaseCollision(categoryDirectory, directoryName)
	assertNoDuplicateDefinitionId(serviceRoot, leaf.id, leaf.kind)
	const leafDirectory = join(categoryDirectory, directoryName)
	const generated = files.map(file => ({ path: join(leafDirectory, file.name), content: file.content }))
	for (const file of generated) {
		assertInsideProject(paths.projectPath, file.path)
		if (existsSync(file.path)) throw new Error(`Harness leaf file already exists: ${file.path}`)
	}
	return { files: generated, directory: leafDirectory, paths }
}

/** Persist a fully preflighted leaf-only scaffold. */
export const writeHarnessLeafScaffold = async (
	prepared: ReturnType<typeof prepareHarnessLeafScaffold>,
): Promise<Pick<PuristaCommandResult, 'createdFiles' | 'updatedFiles'>> => writeHarnessScaffold(prepared.files)
