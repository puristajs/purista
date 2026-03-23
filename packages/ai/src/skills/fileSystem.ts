import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

export type SkillArtifactIndex = {
	references: string[]
	scripts: string[]
	assets: string[]
}

export type SkillMetadata = SkillArtifactIndex & {
	name: string
	description: string
	path: string
	topics?: string[]
	phases?: string[]
	requiresSandbox?: boolean
}

export type SkillDocument = SkillMetadata & {
	content: string
}

export type SkillReferenceDocument = {
	skillName: string
	path: string
	relativePath: string
	content: string
}

export type SkillBundleFile = {
	skillName: string
	path: string
	relativePath: string
	content: Buffer
}

export type SkillBundle = {
	skill: SkillMetadata
	files: SkillBundleFile[]
}

export type SkillSearchInput = {
	skillNames?: string[]
	queries?: string[]
	topics?: string[]
	phases?: string[]
	limit?: number
}

export type SkillSourceInput = {
	content: string
	description?: string
	topics?: string[]
	phases?: string[]
	requiresSandbox?: boolean
	references?: Record<string, string>
	scripts?: Record<string, string | Buffer>
	assets?: Record<string, string | Buffer>
}

export type SkillSourceMap<SkillNames extends string = string> = Record<SkillNames, SkillSourceInput>

export type LayeredSkillRootInput = {
	canonicalRoots?: string[]
	overlayRoots?: string[]
}

export type SkillResource = {
	list(): Promise<SkillMetadata[]>
	load(skillName: string): Promise<SkillDocument>
	loadMany(skillNames: string[]): Promise<SkillDocument[]>
	loadReferences(skillName: string): Promise<SkillReferenceDocument[]>
	loadBundle(skillName: string): Promise<SkillBundle>
	search(input: SkillSearchInput): Promise<SkillDocument[]>
}

const normalizeSkillRoots = (roots: string[]): string[] => [...new Set(roots.map(root => root.trim()).filter(Boolean))]

export const resolveLayeredSkillRoots = (input: LayeredSkillRootInput): string[] =>
	normalizeSkillRoots([...(input.canonicalRoots ?? []), ...(input.overlayRoots ?? [])])

export const createLayeredFileSkillResource = (input: LayeredSkillRootInput): FileSkillResource =>
	new FileSkillResource({ roots: resolveLayeredSkillRoots(input) })

const normalizeList = (values: string[] | undefined): string[] => [
	...new Set((values ?? []).map(entry => entry.trim()).filter(Boolean)),
]

const searchDocuments = (documents: SkillDocument[], input: SkillSearchInput): SkillDocument[] => {
	const limit = input.limit ?? documents.length
	const normalizedQueries = normalizeList(input.queries).map(entry => entry.toLowerCase())
	const normalizedTopics = normalizeList(input.topics).map(entry => entry.toLowerCase())
	const normalizedPhases = normalizeList(input.phases).map(entry => entry.toLowerCase())

	if (normalizedQueries.length === 0 && normalizedTopics.length === 0 && normalizedPhases.length === 0) {
		return documents.slice(0, limit)
	}

	const scored = documents
		.map(document => {
			const haystack =
				`${document.name}\n${document.description}\n${document.topics?.join(' ') ?? ''}\n${document.phases?.join(' ') ?? ''}\n${document.content}`.toLowerCase()
			let score = 0
			const documentTopics = new Set((document.topics ?? []).map(entry => entry.toLowerCase()))
			const documentPhases = new Set((document.phases ?? []).map(entry => entry.toLowerCase()))
			for (const topic of normalizedTopics) {
				if (documentTopics.has(topic)) {
					score += 4
				}
			}
			for (const phase of normalizedPhases) {
				if (documentPhases.has(phase)) {
					score += 5
				}
			}
			for (const query of normalizedQueries) {
				if (haystack.includes(query)) {
					score += query.length > 12 ? 4 : 2
				}
			}
			return { document, score }
		})
		.filter(entry => entry.score > 0)
		.sort((left, right) => right.score - left.score || left.document.name.localeCompare(right.document.name))

	return scored.slice(0, limit).map(entry => entry.document)
}

const parseFrontmatter = (
	content: string,
): {
	metadata: Partial<Pick<SkillMetadata, 'name' | 'description' | 'topics' | 'phases' | 'requiresSandbox'>>
	body: string
} => {
	if (!content.startsWith('---\n')) {
		return { metadata: {}, body: content }
	}

	const closingIndex = content.indexOf('\n---\n', 4)
	if (closingIndex === -1) {
		return { metadata: {}, body: content }
	}

	const rawFrontmatter = content.slice(4, closingIndex)
	const body = content.slice(closingIndex + 5)
	const metadata: Partial<Pick<SkillMetadata, 'name' | 'description' | 'topics' | 'phases' | 'requiresSandbox'>> = {}
	let currentArrayKey: 'topics' | 'phases' | undefined

	for (const line of rawFrontmatter.split('\n')) {
		const trimmed = line.trim()
		if (!trimmed) {
			continue
		}
		if (trimmed.startsWith('- ') && currentArrayKey) {
			metadata[currentArrayKey] = [...(metadata[currentArrayKey] ?? []), trimmed.slice(2).trim()]
			continue
		}
		currentArrayKey = undefined
		const separatorIndex = trimmed.indexOf(':')
		if (separatorIndex === -1) {
			continue
		}
		const key = trimmed.slice(0, separatorIndex).trim()
		const value = trimmed.slice(separatorIndex + 1).trim()
		switch (key) {
			case 'name':
				metadata.name = value
				break
			case 'description':
				metadata.description = value
				break
			case 'topics':
				currentArrayKey = 'topics'
				if (value.startsWith('[') && value.endsWith(']')) {
					metadata.topics = value
						.slice(1, -1)
						.split(',')
						.map(entry => entry.trim())
						.filter(Boolean)
				}
				break
			case 'phases':
				currentArrayKey = 'phases'
				if (value.startsWith('[') && value.endsWith(']')) {
					metadata.phases = value
						.slice(1, -1)
						.split(',')
						.map(entry => entry.trim())
						.filter(Boolean)
				}
				break
			case 'requires_sandbox':
			case 'requiresSandbox':
				metadata.requiresSandbox = value === 'true'
				break
			default:
				break
		}
	}

	return { metadata, body: body.trim() }
}

const summarizeDescription = (body: string): string => {
	const firstParagraph = body
		.split('\n\n')
		.map(entry => entry.trim())
		.find(Boolean)
	if (!firstParagraph) {
		return ''
	}
	return firstParagraph.length > 220 ? `${firstParagraph.slice(0, 217)}...` : firstParagraph
}

const listRelativeFiles = async (root: string): Promise<string[]> => {
	const entries = await readdir(root, { withFileTypes: true })
	const files = await Promise.all(
		entries.map(async entry => {
			const absolutePath = join(root, entry.name)
			if (entry.isDirectory()) {
				const nested = await listRelativeFiles(absolutePath)
				return nested.map(path => join(entry.name, path))
			}
			if (!entry.isFile()) {
				return []
			}
			return [entry.name]
		}),
	)
	return files.flat().sort((left, right) => {
		if (left === 'SKILL.md') {
			return -1
		}
		if (right === 'SKILL.md') {
			return 1
		}
		return left.localeCompare(right)
	})
}

const discoverSkillArtifacts = async (skillPath: string): Promise<SkillArtifactIndex> => {
	const skillDir = dirname(skillPath)

	const load = async (directoryName: keyof SkillArtifactIndex) => {
		try {
			return await listRelativeFiles(join(skillDir, directoryName))
		} catch {
			return []
		}
	}

	return {
		references: await load('references'),
		scripts: await load('scripts'),
		assets: await load('assets'),
	}
}

export class FileSkillResource implements SkillResource {
	private readonly cache = new Map<string, Promise<SkillDocument>>()
	private readonly referencesCache = new Map<string, Promise<SkillReferenceDocument[]>>()
	private readonly bundleCache = new Map<string, Promise<SkillBundle>>()

	constructor(private readonly input: { roots: string[] }) {}

	private getCandidatePaths(skillName: string) {
		return [...this.input.roots].reverse().map(root => join(root, skillName.trim(), 'SKILL.md'))
	}

	async list(): Promise<SkillMetadata[]> {
		const names = new Set<string>()
		for (const root of this.input.roots) {
			try {
				const entries = await readdir(root, { withFileTypes: true })
				for (const entry of entries) {
					if (entry.isDirectory()) {
						names.add(entry.name)
					}
				}
			} catch {}
		}

		const docs = await Promise.all(
			[...names].sort().map(async skillName => {
				try {
					return await this.load(skillName)
				} catch {
					return undefined
				}
			}),
		)

		return docs
			.filter((entry): entry is SkillDocument => Boolean(entry))
			.map(({ content: _content, ...metadata }) => metadata)
	}

	async load(skillName: string): Promise<SkillDocument> {
		const normalizedSkillName = skillName.trim()
		const cached = this.cache.get(normalizedSkillName)
		if (cached) {
			return await cached
		}

		const documentPromise = (async () => {
			let loadedContent: string | undefined
			let loadedPath: string | undefined
			for (const candidate of this.getCandidatePaths(normalizedSkillName)) {
				try {
					loadedContent = await readFile(candidate, 'utf8')
					loadedPath = candidate
					break
				} catch {}
			}
			if (!loadedContent || !loadedPath) {
				throw new Error(`Skill ${normalizedSkillName} not found in configured roots`)
			}
			const { metadata, body } = parseFrontmatter(loadedContent)
			const artifacts = await discoverSkillArtifacts(loadedPath)
			return {
				name: metadata.name?.trim() || normalizedSkillName,
				description: metadata.description?.trim() || summarizeDescription(body),
				topics: metadata.topics,
				phases: metadata.phases,
				requiresSandbox: metadata.requiresSandbox,
				path: loadedPath,
				...artifacts,
				content: body,
			}
		})()

		this.cache.set(normalizedSkillName, documentPromise)
		return await documentPromise
	}

	async loadMany(skillNames: string[]): Promise<SkillDocument[]> {
		return await Promise.all(
			[...new Set(skillNames.map(entry => entry.trim()).filter(Boolean))]
				.sort()
				.map(async skillName => await this.load(skillName)),
		)
	}

	async loadReferences(skillName: string): Promise<SkillReferenceDocument[]> {
		const normalizedSkillName = skillName.trim()
		const cached = this.referencesCache.get(normalizedSkillName)
		if (cached) {
			return await cached
		}

		const referencePromise = (async () => {
			const skillDocument = await this.load(normalizedSkillName)
			const skillDir = dirname(skillDocument.path)
			return await Promise.all(
				skillDocument.references.map(async referencePath => {
					const absolutePath = join(skillDir, 'references', referencePath)
					return {
						skillName: skillDocument.name,
						path: absolutePath,
						relativePath: relative(skillDir, absolutePath),
						content: await readFile(absolutePath, 'utf8'),
					}
				}),
			)
		})()

		this.referencesCache.set(normalizedSkillName, referencePromise)
		return await referencePromise
	}

	async loadBundle(skillName: string): Promise<SkillBundle> {
		const normalizedSkillName = skillName.trim()
		const cached = this.bundleCache.get(normalizedSkillName)
		if (cached) {
			return await cached
		}

		const bundlePromise = (async () => {
			const skill = await this.load(normalizedSkillName)
			const skillDir = dirname(skill.path)
			const files = await listRelativeFiles(skillDir)
			const { content: _content, ...metadata } = skill
			return {
				skill: metadata,
				files: await Promise.all(
					files.map(async relativePath => {
						const absolutePath = join(skillDir, relativePath)
						return {
							skillName: skill.name,
							path: absolutePath,
							relativePath,
							content: await readFile(absolutePath),
						}
					}),
				),
			}
		})()

		this.bundleCache.set(normalizedSkillName, bundlePromise)
		return await bundlePromise
	}

	async search(input: SkillSearchInput): Promise<SkillDocument[]> {
		const listed = await this.list()
		const candidateNames =
			input.skillNames && input.skillNames.length > 0
				? [...new Set(input.skillNames.map(entry => entry.trim()).filter(Boolean))]
				: listed.map(entry => entry.name)
		const documents = await this.loadMany(candidateNames)
		return searchDocuments(documents, input)
	}
}

export class InlineSkillResource<SkillNames extends string = string> implements SkillResource {
	constructor(private readonly sources: SkillSourceMap<SkillNames>) {}

	private getNames(): string[] {
		return Object.keys(this.sources).sort()
	}

	private getSource(skillName: string): SkillSourceInput {
		const source = this.sources[skillName as SkillNames]
		if (!source) {
			throw new Error(`Skill ${skillName} not found in inline skill catalog`)
		}
		return source
	}

	private toDocument(skillName: string): SkillDocument {
		const source = this.getSource(skillName)
		return {
			name: skillName,
			description: source.description?.trim() || summarizeDescription(source.content),
			path: `inline://skills/${skillName}/SKILL.md`,
			topics: normalizeList(source.topics),
			phases: normalizeList(source.phases),
			requiresSandbox: source.requiresSandbox,
			references: Object.keys(source.references ?? {}).sort(),
			scripts: Object.keys(source.scripts ?? {}).sort(),
			assets: Object.keys(source.assets ?? {}).sort(),
			content: source.content.trim(),
		}
	}

	async list(): Promise<SkillMetadata[]> {
		return this.getNames().map(skillName => {
			const { content: _content, ...metadata } = this.toDocument(skillName)
			return metadata
		})
	}

	async load(skillName: string): Promise<SkillDocument> {
		return this.toDocument(skillName.trim())
	}

	async loadMany(skillNames: string[]): Promise<SkillDocument[]> {
		return normalizeList(skillNames)
			.sort()
			.map(skillName => this.toDocument(skillName))
	}

	async loadReferences(skillName: string): Promise<SkillReferenceDocument[]> {
		const source = this.getSource(skillName.trim())
		return Object.entries(source.references ?? {})
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([relativePath, content]) => ({
				skillName: skillName.trim(),
				path: `inline://skills/${skillName}/references/${relativePath}`,
				relativePath: `references/${relativePath}`,
				content,
			}))
	}

	async loadBundle(skillName: string): Promise<SkillBundle> {
		const normalizedSkillName = skillName.trim()
		const source = this.getSource(normalizedSkillName)
		const skill = await this.load(normalizedSkillName)
		const { content: _content, ...metadata } = skill
		const toBuffer = (value: string | Buffer): Buffer =>
			typeof value === 'string' ? Buffer.from(value, 'utf8') : value
		const files: SkillBundleFile[] = [
			{
				skillName: normalizedSkillName,
				path: `inline://skills/${normalizedSkillName}/SKILL.md`,
				relativePath: 'SKILL.md',
				content: Buffer.from(source.content, 'utf8'),
			},
			...Object.entries(source.references ?? {}).map(([relativePath, content]) => ({
				skillName: normalizedSkillName,
				path: `inline://skills/${normalizedSkillName}/references/${relativePath}`,
				relativePath: `references/${relativePath}`,
				content: Buffer.from(content, 'utf8'),
			})),
			...Object.entries(source.scripts ?? {}).map(([relativePath, content]) => ({
				skillName: normalizedSkillName,
				path: `inline://skills/${normalizedSkillName}/scripts/${relativePath}`,
				relativePath: `scripts/${relativePath}`,
				content: toBuffer(content),
			})),
			...Object.entries(source.assets ?? {}).map(([relativePath, content]) => ({
				skillName: normalizedSkillName,
				path: `inline://skills/${normalizedSkillName}/assets/${relativePath}`,
				relativePath: `assets/${relativePath}`,
				content: toBuffer(content),
			})),
		]
		return {
			skill: metadata,
			files,
		}
	}

	async search(input: SkillSearchInput): Promise<SkillDocument[]> {
		const candidateNames =
			input.skillNames && input.skillNames.length > 0 ? normalizeList(input.skillNames) : this.getNames()
		return searchDocuments(
			candidateNames.map(skillName => this.toDocument(skillName)),
			input,
		)
	}
}

export const createInlineSkillResource = <SkillNames extends string>(
	sources: SkillSourceMap<SkillNames>,
): InlineSkillResource<SkillNames> => new InlineSkillResource(sources)

export const renderSkillDocuments = (
	label: string,
	skillDocs: Array<Pick<SkillDocument, 'name' | 'content'>>,
): string | undefined =>
	skillDocs.length > 0
		? `${label}:\n${skillDocs.map(document => `## ${document.name}\n${document.content}`).join('\n\n')}`
		: undefined

export const renderSkillReferences = (
	label: string,
	references: Array<Pick<SkillReferenceDocument, 'skillName' | 'relativePath' | 'content'>>,
): string | undefined =>
	references.length > 0
		? `${label}:\n${references
				.map(reference => `## ${reference.skillName} / ${reference.relativePath}\n${reference.content}`)
				.join('\n\n')}`
		: undefined
