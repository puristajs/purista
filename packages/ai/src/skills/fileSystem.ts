import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export type SkillMetadata = {
	name: string
	description: string
	path: string
	topics?: string[]
	requiresSandbox?: boolean
}

export type SkillDocument = SkillMetadata & {
	content: string
}

export type SkillSearchInput = {
	skillNames?: string[]
	queries?: string[]
	limit?: number
}

export type SkillResource = {
	list(): Promise<SkillMetadata[]>
	load(skillName: string): Promise<SkillDocument>
	loadMany(skillNames: string[]): Promise<SkillDocument[]>
	search(input: SkillSearchInput): Promise<SkillDocument[]>
}

const parseFrontmatter = (content: string): {
	metadata: Partial<Pick<SkillMetadata, 'name' | 'description' | 'topics' | 'requiresSandbox'>>
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
	const metadata: Partial<Pick<SkillMetadata, 'name' | 'description' | 'topics' | 'requiresSandbox'>> = {}
	let currentArrayKey: 'topics' | undefined

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

export class FileSkillResource implements SkillResource {
	private readonly cache = new Map<string, Promise<SkillDocument>>()

	constructor(private readonly input: { roots: string[] }) {}

	private getCandidatePaths(skillName: string) {
		return this.input.roots.map(root => join(root, skillName.trim(), 'SKILL.md'))
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
			} catch {
				continue
			}
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
				} catch {
					continue
				}
			}
			if (!loadedContent || !loadedPath) {
				throw new Error(`Skill ${normalizedSkillName} not found in configured roots`)
			}
			const { metadata, body } = parseFrontmatter(loadedContent)
			return {
				name: metadata.name?.trim() || normalizedSkillName,
				description: metadata.description?.trim() || summarizeDescription(body),
				topics: metadata.topics,
				requiresSandbox: metadata.requiresSandbox,
				path: loadedPath,
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

	async search(input: SkillSearchInput): Promise<SkillDocument[]> {
		const listed = await this.list()
		const candidateNames =
			input.skillNames && input.skillNames.length > 0
				? [...new Set(input.skillNames.map(entry => entry.trim()).filter(Boolean))]
				: listed.map(entry => entry.name)
		const limit = input.limit ?? candidateNames.length
		const normalizedQueries = [
			...new Set((input.queries ?? []).map(entry => entry.trim().toLowerCase()).filter(Boolean)),
		]
		const documents = await this.loadMany(candidateNames)
		if (normalizedQueries.length === 0) {
			return documents.slice(0, limit)
		}

		const scored = documents
			.map(document => {
				const haystack =
					`${document.name}\n${document.description}\n${document.topics?.join(' ') ?? ''}\n${document.content}`.toLowerCase()
				let score = 0
				for (const query of normalizedQueries) {
					if (haystack.includes(query)) {
						score += query.length > 12 ? 4 : 2
					}
				}
				return { document, score }
			})
			.filter(entry => entry.score > 0)
			.sort(
				(left, right) =>
					right.score - left.score || left.document.name.localeCompare(right.document.name),
			)

		return scored.slice(0, limit).map(entry => entry.document)
	}
}
