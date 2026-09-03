import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const apiJsonPath = resolve(process.cwd(), 'src/generated/purista-api.json')

const REFLECTION_KIND = {
	module: 2,
	enum: 8,
	variable: 32,
	function: 64,
	class: 128,
	interface: 256,
	constructor: 512,
	property: 1024,
	method: 2048,
	callSignature: 4096,
	constructorSignature: 16384,
	typeAlias: 2097152,
} as const

const ROUTE_BY_KIND = new Map<number, string>([
	[REFLECTION_KIND.module, 'modules'],
	[REFLECTION_KIND.class, 'classes'],
	[REFLECTION_KIND.interface, 'interfaces'],
	[REFLECTION_KIND.function, 'functions'],
	[REFLECTION_KIND.typeAlias, 'types'],
	[REFLECTION_KIND.enum, 'enums'],
	[REFLECTION_KIND.variable, 'variables'],
])

const LABEL_BY_ROUTE = new Map<string, string>([
	['modules', 'Packages'],
	['classes', 'Classes'],
	['interfaces', 'Interfaces'],
	['functions', 'Functions'],
	['types', 'Types'],
	['enums', 'Enums'],
	['variables', 'Variables'],
])

interface TypeDocCommentPart {
	kind: string
	text?: string
}

interface TypeDocBlockTag {
	tag: string
	content?: TypeDocCommentPart[]
}

interface TypeDocComment {
	summary?: TypeDocCommentPart[]
	blockTags?: TypeDocBlockTag[]
}

interface TypeDocSource {
	fileName?: string
	line?: number
	url?: string
}

interface TypeDocGroup {
	title: string
	children: number[]
}

interface TypeDocReflection {
	id: number
	name: string
	kind: number
	flags?: Record<string, boolean>
	children?: TypeDocReflection[]
	groups?: TypeDocGroup[]
	comment?: TypeDocComment
	sources?: TypeDocSource[]
	signatures?: TypeDocReflection[]
	parameters?: TypeDocReflection[]
	typeParameters?: TypeDocReflection[]
	type?: TypeDocType
	defaultValue?: string
}

interface TypeDocProject extends TypeDocReflection {
	children: TypeDocReflection[]
}

type TypeDocType =
	| { type: 'intrinsic'; name: string }
	| { type: 'reference'; name: string; typeArguments?: TypeDocType[]; qualifiedName?: string }
	| { type: 'literal'; value: string | number | boolean | null }
	| { type: 'array'; elementType: TypeDocType }
	| { type: 'union' | 'intersection'; types: TypeDocType[] }
	| { type: 'reflection'; declaration?: TypeDocReflection }
	| { type: 'indexedAccess'; objectType: TypeDocType; indexType: TypeDocType }
	| { type: 'conditional'; checkType?: TypeDocType; extendsType?: TypeDocType; trueType?: TypeDocType; falseType?: TypeDocType }
	| { type: 'query'; queryType?: TypeDocType }
	| { type: 'tuple'; elements?: TypeDocType[] }
	| { type: 'templateLiteral'; head?: string; tail?: { text: string; type: TypeDocType }[] }
	| { type: string; name?: string }

export interface ApiItem {
	id: number
	name: string
	slug: string
	route: string
	href: string
	label: string
	packageName: string
	summary: string
	source?: TypeDocSource
	signature: string
	reflection: TypeDocReflection
	module: TypeDocReflection
}

export interface ApiGroup {
	route: string
	title: string
	items: ApiItem[]
}

export interface ApiOverview {
	projectName: string
	packages: ApiItem[]
	groups: ApiGroup[]
	totalExports: number
}

export interface ApiMemberGroup {
	title: string
	items: ApiItem[]
}

export interface ApiPage extends ApiItem {
	examples: string[]
	blockTags: { tag: string; text: string }[]
	memberGroups: ApiMemberGroup[]
}

let projectCache: TypeDocProject | undefined
let itemsCache: ApiItem[] | undefined

function loadProject(): TypeDocProject {
	if (projectCache) return projectCache
	if (!existsSync(apiJsonPath)) {
		throw new Error(
			`Missing generated API documentation at ${apiJsonPath}. Run "npm run build:api-docs" before building the website.`,
		)
	}
	projectCache = JSON.parse(readFileSync(apiJsonPath, 'utf8')) as TypeDocProject
	return projectCache
}

function slugify(value: string): string {
	return value
		.replace(/^@/, '_')
		.replace(/\//g, '_')
		.replace(/[^a-zA-Z0-9_.-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/**
 * API member links are used from task-focused handbook pages. Reflection IDs
 * change when TypeDoc is regenerated, so member fragments intentionally use
 * the stable public member name instead.
 */
function memberFragment(name: string): string {
	return slugify(name).toLowerCase()
}

function textFromParts(parts: TypeDocCommentPart[] = []): string {
	return parts
		.map(part => part.text ?? '')
		.join('')
		.trim()
}

function summaryOf(reflection: TypeDocReflection): string {
	const text = textFromParts(reflection.comment?.summary)
	if (!text) return ''
	return text.split('\n\n')[0]?.trim() ?? text
}

function getRoute(kind: number): string | undefined {
	return ROUTE_BY_KIND.get(kind)
}

function getLabel(route: string): string {
	return LABEL_BY_ROUTE.get(route) ?? route
}

function getPackageName(module: TypeDocReflection): string {
	return module.name
}

function typeParametersToString(typeParameters: TypeDocReflection[] = []): string {
	if (typeParameters.length === 0) return ''
	return `<${typeParameters.map(parameter => parameter.name).join(', ')}>`
}

function typeToString(type: TypeDocType | undefined, depth = 0): string {
	if (!type) return 'void'
	if (depth > 4) return 'unknown'

	switch (type.type) {
		case 'intrinsic':
			return type.name
		case 'reference': {
			const args = type.typeArguments?.length
				? `<${type.typeArguments.map(argument => typeToString(argument, depth + 1)).join(', ')}>`
				: ''
			return `${type.name}${args}`
		}
		case 'literal':
			return typeof type.value === 'string' ? JSON.stringify(type.value) : String(type.value)
		case 'array':
			return `${typeToString(type.elementType, depth + 1)}[]`
		case 'union':
			return type.types.map(item => typeToString(item, depth + 1)).join(' | ')
		case 'intersection':
			return type.types.map(item => typeToString(item, depth + 1)).join(' & ')
		case 'indexedAccess':
			return `${typeToString(type.objectType, depth + 1)}[${typeToString(type.indexType, depth + 1)}]`
		case 'reflection':
			if (type.declaration?.signatures?.[0]) {
				const signature = type.declaration.signatures[0]
				return `(${parametersToString(signature.parameters)}) => ${typeToString(signature.type, depth + 1)}`
			}
			if (type.declaration?.children?.length) {
				const members = type.declaration.children
					.slice(0, 6)
					.map(child => `${child.name}: ${typeToString(child.type, depth + 1)}`)
					.join('; ')
				return `{ ${members}${type.declaration.children.length > 6 ? '; ...' : ''} }`
			}
			return 'object'
		case 'conditional':
			return `${typeToString(type.checkType, depth + 1)} extends ${typeToString(type.extendsType, depth + 1)} ? ${typeToString(type.trueType, depth + 1)} : ${typeToString(type.falseType, depth + 1)}`
		case 'query':
			return `typeof ${typeToString(type.queryType, depth + 1)}`
		case 'tuple':
			return `[${(type.elements ?? []).map(item => typeToString(item, depth + 1)).join(', ')}]`
		case 'templateLiteral':
			return '`template`'
		default:
			return type.name ?? type.type
	}
}

function parametersToString(parameters: TypeDocReflection[] = []): string {
	return parameters
		.map(parameter => {
			const rest = parameter.flags?.isRest ? '...' : ''
			const optional = parameter.flags?.isOptional ? '?' : ''
			return `${rest}${parameter.name}${optional}: ${typeToString(parameter.type)}`
		})
		.join(', ')
}

function signatureOf(reflection: TypeDocReflection): string {
	const signature = reflection.signatures?.[0]
	if (signature) {
		const params = parametersToString(signature.parameters)
		const typeParameters = typeParametersToString(signature.typeParameters)
		if (reflection.kind === REFLECTION_KIND.constructor) {
			return `new ${reflection.name}${typeParameters}(${params})`
		}
		return `${reflection.name}${typeParameters}(${params}): ${typeToString(signature.type)}`
	}

	if (reflection.kind === REFLECTION_KIND.class) return `class ${reflection.name}${typeParametersToString(reflection.typeParameters)}`
	if (reflection.kind === REFLECTION_KIND.interface) return `interface ${reflection.name}${typeParametersToString(reflection.typeParameters)}`
	if (reflection.kind === REFLECTION_KIND.enum) return `enum ${reflection.name}`
	if (reflection.kind === REFLECTION_KIND.typeAlias) return `type ${reflection.name} = ${typeToString(reflection.type)}`
	if (reflection.kind === REFLECTION_KIND.variable) return `const ${reflection.name}: ${typeToString(reflection.type)}`
	if (reflection.kind === REFLECTION_KIND.property) return `${reflection.name}: ${typeToString(reflection.type)}`
	if (reflection.kind === REFLECTION_KIND.method) return `${reflection.name}(${parametersToString(reflection.parameters)}): ${typeToString(reflection.type)}`
	return reflection.name
}

function toApiItem(reflection: TypeDocReflection, module: TypeDocReflection): ApiItem | undefined {
	const route = getRoute(reflection.kind)
	if (!route) return undefined
	const slug = slugify(reflection.kind === REFLECTION_KIND.module ? reflection.name : `${module.name}.${reflection.name}`)
	return {
		id: reflection.id,
		name: reflection.name,
		slug,
		route,
		href: `/handbook/api/${route}/${slug}/`,
		label: getLabel(route),
		packageName: getPackageName(module),
		summary: summaryOf(reflection),
		source: reflection.sources?.[0],
		signature: signatureOf(reflection),
		reflection,
		module,
	}
}

function getAllItems(): ApiItem[] {
	if (itemsCache) return itemsCache
	const project = loadProject()
	const items: ApiItem[] = []
	for (const module of project.children ?? []) {
		const moduleItem = toApiItem(module, module)
		if (moduleItem) items.push(moduleItem)
		for (const child of module.children ?? []) {
			const item = toApiItem(child, module)
			if (item) items.push(item)
		}
	}
	itemsCache = items.sort((a, b) => a.name.localeCompare(b.name))
	return itemsCache
}

function itemsByIds(ids: number[] = [], module: TypeDocReflection): ApiItem[] {
	const children = new Map((module.children ?? []).map(child => [child.id, child]))
	return ids
		.map(id => children.get(id))
		.filter((reflection): reflection is TypeDocReflection => Boolean(reflection))
		.map(reflection => toApiItem(reflection, module))
		.filter((item): item is ApiItem => Boolean(item))
}

function visibleMemberGroups(reflection: TypeDocReflection, module: TypeDocReflection): ApiMemberGroup[] {
	const childById = new Map((reflection.children ?? []).map(child => [child.id, child]))
	const groups = reflection.groups ?? []
	if (groups.length === 0) {
		const items = (reflection.children ?? [])
			.filter(child =>
				[
					REFLECTION_KIND.constructor,
					REFLECTION_KIND.method,
					REFLECTION_KIND.property,
					REFLECTION_KIND.function,
					REFLECTION_KIND.typeAlias,
				].includes(child.kind),
			)
			.map(child => memberToItem(child, module))
		return items.length ? [{ title: 'Members', items }] : []
	}

	return groups
		.map(group => ({
			title: group.title,
			items: group.children
				.map(id => childById.get(id))
				.filter((child): child is TypeDocReflection => Boolean(child))
				.map(child => memberToItem(child, module)),
		}))
		.filter(group => group.items.length > 0)
}

function memberToItem(reflection: TypeDocReflection, module: TypeDocReflection): ApiItem {
	return {
		id: reflection.id,
		name: reflection.name,
		slug: slugify(`${module.name}.${reflection.name}.${reflection.id}`),
		route: 'members',
		href: `#${memberFragment(reflection.name)}`,
		label: memberKindLabel(reflection.kind),
		packageName: module.name,
		summary: summaryOf(reflection.signatures?.[0] ?? reflection),
		source: reflection.sources?.[0] ?? reflection.signatures?.[0]?.sources?.[0],
		signature: signatureOf(reflection),
		reflection,
		module,
	}
}

function memberKindLabel(kind: number): string {
	switch (kind) {
		case REFLECTION_KIND.constructor:
			return 'Constructor'
		case REFLECTION_KIND.method:
			return 'Method'
		case REFLECTION_KIND.property:
			return 'Property'
		default:
			return 'Member'
	}
}

function examplesOf(reflection: TypeDocReflection): string[] {
	return (reflection.comment?.blockTags ?? [])
		.filter(tag => tag.tag === '@example')
		.map(tag => textFromParts(tag.content))
		.map(example => example.replace(/^```[a-z]*\n?/i, '').replace(/```$/i, '').trim())
		.filter(Boolean)
}

function blockTagsOf(reflection: TypeDocReflection): { tag: string; text: string }[] {
	return (reflection.comment?.blockTags ?? [])
		.filter(tag => !['@example', '@group'].includes(tag.tag))
		.map(tag => ({ tag: tag.tag.replace(/^@/, ''), text: textFromParts(tag.content) }))
		.filter(tag => Boolean(tag.text))
}

export function getApiOverview(): ApiOverview {
	const project = loadProject()
	const allItems = getAllItems()
	const packages = allItems.filter(item => item.route === 'modules')
	const groups = ['classes', 'interfaces', 'functions', 'types', 'enums', 'variables']
		.map(route => ({
			route,
			title: getLabel(route),
			items: allItems.filter(item => item.route === route),
		}))
		.filter(group => group.items.length > 0)
	return {
		projectName: project.name,
		packages,
		groups,
		totalExports: allItems.length - packages.length,
	}
}

export function getApiStaticPaths() {
	return getAllItems().map(item => ({
		params: { slug: `${item.route}/${item.slug}` },
		props: { item },
	}))
}

export function getApiPage(item: ApiItem): ApiPage {
	const memberGroups =
		item.reflection.kind === REFLECTION_KIND.module
			? (item.reflection.groups ?? [])
					.map(group => ({
						title: group.title,
						items: itemsByIds(group.children, item.reflection),
					}))
					.filter(group => group.items.length > 0)
			: visibleMemberGroups(item.reflection, item.module)

	return {
		...item,
		examples: examplesOf(item.reflection),
		blockTags: blockTagsOf(item.reflection),
		memberGroups,
	}
}
