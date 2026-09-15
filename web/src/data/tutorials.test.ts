import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import {
	getPublishedTutorialEntries,
	getTutorialBreadcrumbs,
	getTutorialPageNavigation,
	getTutorialSidebar,
	tutorialIndexId,
	getVisibleTutorialEntries,
	tutorialRoute,
	type TutorialEntry,
} from './tutorials'

/** Supply only the content fields used by navigation; Astro rendering is tested by the site build. */
function entry(id: string, order: number, kind: TutorialEntry['data']['kind'] = 'lesson', extra: Partial<TutorialEntry['data']> = {}): TutorialEntry {
	return {
		id, collection: 'tutorials', body: '',
		data: { title: id, order, kind, status: 'published', optional: false, ...extra },
	}
}

const pages = [
	entry('state', 10, 'chapter', { group: 'start' }),
	entry('state/setup/prepare', 10),
	entry('state/build/create', 10),
	entry('state/build/save', 20),
	entry('state/testing/mock', 10),
	entry('state/extensions/history/define', 10),
	entry('state/extensions/history/test', 20),
]

const coursePath = fileURLToPath(new URL('../../../examples/banking/tutorial/course.json', import.meta.url))
const contentRoot = fileURLToPath(new URL('../content/tutorials/', import.meta.url))
const course = JSON.parse(readFileSync(coursePath, 'utf8')) as {
	chapters: { id: string; title: string; status: 'draft' | 'published'; pages: string[] }[]
	baselines: { id: string; pages: string[] }[]
}

const capabilityRoots = [
	'create-project', 'hono-webserver', 'static-website', 'rest-endpoints',
	'database-resource', 'protected-endpoints', 'sessions', 'business-guards',
	'command-transforms', 'external-resources', 'command-result-events', 'subscriptions',
	'streams', 'queue-processing', 'schedules', 'observability', 'distributed-runtime',
	'classification-agent', 'ai-guardrails', 'retrieval-ingestion', 'conversation-memory',
	'agent-tools', 'agent-skills', 'human-review-workflow', 'parallel-agents',
	'multi-step-workflow', 'sandbox-analysis', 'agent-evaluation',
] as const

const aiCapabilityRoots = capabilityRoots.slice(17)

function tutorialContentIds(directory = contentRoot): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap(item => {
		const path = join(directory, item.name)
		if (item.isDirectory()) return tutorialContentIds(path)
		if (!/\.mdx?$/.test(item.name)) return []
		const id = relative(contentRoot, path).split(sep).join('/').replace(/\.mdx?$/, '').replace(/\/index$/, '')
		return [id || tutorialIndexId]
	})
}

function frontmatter(source: string, field: string): string | undefined {
	return source.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))?.[1]?.trim()
}

describe('tutorial reading structure', () => {
	test('keeps Build before Testing despite locally repeated order numbers', () => {
		const navigation = getTutorialPageNavigation(pages, 'state/build/save')
		expect(navigation.previous?.id).toBe('state/build/create')
		expect(navigation.next?.id).toBe('state/testing/mock')
		expect(getTutorialPageNavigation(pages, 'state/testing/mock').next).toBeUndefined()
	})

	test('places independent setup pages before Build', () => {
		const chapter = getTutorialSidebar(pages)[1]
		expect(chapter.items?.map(item => item.title)).toEqual([
			'Set up the example',
			'Build',
			'Test with PURISTA',
			'Optional extensions',
		])
		expect(getTutorialPageNavigation(pages, 'state/setup/prepare').next?.id).toBe('state/build/create')
	})

	test('keeps optional reading within its branch with a return to the chapter', () => {
		const navigation = getTutorialPageNavigation(pages, 'state/extensions/history/define')
		expect(navigation.previous?.id).toBe('state')
		expect(navigation.next?.id).toBe('state/extensions/history/test')
		expect(getTutorialPageNavigation(pages, 'state/extensions/history/test').next).toBeUndefined()
	})

	test('preserves deeper levels and gives virtual groups an existing destination', () => {
		const chapter = getTutorialSidebar(pages)[1]
		expect(chapter.items?.map(item => item.title)).toEqual([
			'Set up the example',
			'Build',
			'Test with PURISTA',
			'Optional extensions',
		])
		const history = chapter.items?.[3].items?.[0]
		expect(history?.items?.map(item => item.id)).toEqual(['state/extensions/history/define', 'state/extensions/history/test'])
		expect(history?.href).toBe('/tutorials/state/extensions/history/define/')
	})

	test('makes missing group index breadcrumbs labels instead of broken links', () => {
		expect(getTutorialBreadcrumbs(pages, 'state/extensions/history/test')).toEqual([
			{ title: 'Tutorials', href: '/tutorials/' },
			{ title: 'state', href: '/tutorials/state/' },
			{ title: 'Optional extensions', href: undefined },
			{ title: 'history', href: undefined },
		])
	})

	test('hides descendants when their chapter is draft', () => {
		const hidden = [entry('state', 10, 'chapter', { group: 'start', status: 'draft' }), ...pages.slice(1)]
		expect(getPublishedTutorialEntries(hidden)).toEqual([])
		expect(getTutorialSidebar(hidden)).toEqual([])
	})

	test('includes draft chapters and their descendants for local preview', () => {
		const hidden = [
			entry('agent', 10, 'chapter', { group: 'ai', status: 'draft' }),
			entry('agent/build/define', 10),
		]

		expect(getVisibleTutorialEntries(hidden, { includeDrafts: true })).toEqual(hidden)
		expect(getTutorialSidebar(hidden, { includeDrafts: true })).toMatchObject([
			{ title: 'Add AI capabilities', kind: 'sectionHeader' },
			{ id: 'agent', title: 'agent' },
		])
	})

	test('rejects ambiguous sibling order instead of silently sorting by title', () => {
		expect(() => getTutorialSidebar([...pages, entry('state/build/duplicate', 10)])).toThrow('Duplicate tutorial sibling order')
	})

	test('normalizes index routes and rejects colliding IDs', () => {
		expect(tutorialRoute('state/index')).toBe('/tutorials/state/')
		expect(tutorialRoute('index')).toBe('/tutorials/')
		expect(() => getPublishedTutorialEntries([...pages, entry('state/index', 10)])).toThrow('Duplicate normalized tutorial content ID')
	})
})

describe('tutorial course navigation contract', () => {
	test('keeps all 28 capability roots in the required capability-first order', () => {
		expect(course.chapters.map(chapter => chapter.id)).toEqual(capabilityRoots)
		expect(course.chapters).toHaveLength(28)
	})

	test('publishes every AI capability under Add AI capabilities', () => {
		const chapterEntries = course.chapters.map((chapter, index) => {
			const source = readFileSync(`${contentRoot}/${chapter.id}/index.mdx`, 'utf8')
			return entry(chapter.id, index + 1, 'chapter', {
				title: chapter.title,
				status: frontmatter(source, 'status') as 'draft' | 'published',
				group: frontmatter(source, 'group') as TutorialEntry['data']['group'],
			})
		})

		const publishedSidebar = getTutorialSidebar(chapterEntries)
		const aiHeader = publishedSidebar.findIndex(item => item.id === 'group-ai')
		expect(aiHeader).toBeGreaterThanOrEqual(0)
		expect(publishedSidebar[aiHeader]).toMatchObject({ title: 'Add AI capabilities', kind: 'sectionHeader' })
		expect(publishedSidebar.slice(aiHeader + 1, aiHeader + 1 + aiCapabilityRoots.length).map(item => item.id)).toEqual(aiCapabilityRoots)
		expect(chapterEntries.filter(item => item.data.status === 'published')).toHaveLength(capabilityRoots.length)
	})

	test('lists every content page in the course manifest and keeps root status aligned', () => {
		const expected = new Set<string>([tutorialIndexId, ...course.chapters.map(chapter => chapter.id)])
		for (const recipe of [...course.chapters, ...course.baselines]) {
			for (const page of recipe.pages) expected.add(page)
		}
		expect(tutorialContentIds().sort()).toEqual([...expected].sort())

		for (const chapter of course.chapters) {
			const source = readFileSync(`${contentRoot}/${chapter.id}/index.mdx`, 'utf8')
			expect(frontmatter(source, 'kind')).toBe('chapter')
			expect(frontmatter(source, 'status')).toBe(chapter.status)
		}
	})

	test('keeps the course landing list aligned with the manifest order', () => {
		const source = readFileSync(`${contentRoot}/index.mdx`, 'utf8')
		const courseChapterSection = source.match(/## Course chapters\n([\s\S]*?)\n## Start here/)
		expect(courseChapterSection).toBeTruthy()
		const listedRoots = [...courseChapterSection![1].matchAll(/\]\(\/tutorials\/([^/]+)\/\)/g)].map(([, id]) => id)
		expect(listedRoots).toEqual(capabilityRoots)
	})
})
