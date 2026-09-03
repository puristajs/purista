import type { CollectionEntry } from 'astro:content'
import type { SidebarItem } from '../lib/sidebar'

export type TutorialEntry = CollectionEntry<'tutorials'>
type TutorialNode = SidebarItem & { entry?: TutorialEntry; items?: TutorialNode[] }
export type TutorialVisibility = Readonly<{ includeDrafts?: boolean }>
const groupLabels = {
	start: 'Start here', services: 'Connect services', ai: 'Add AI capabilities',
	workflows: 'Combine AI capabilities', operate: 'Run and explore',
} as const
const branchLabels: Record<string, { title: string; order: number }> = {
	setup: { title: 'Set up the example', order: 5 },
	build: { title: 'Build', order: 10 },
	testing: { title: 'Test with PURISTA', order: 20 },
	extensions: { title: 'Optional extensions', order: 30 },
}
export const tutorialIndexId = 'index'

/** Normalize Astro's chapter/index IDs into a canonical URL segment. */
export function tutorialRouteSlug(id: string): string {
	return id === tutorialIndexId ? '' : id.replace(/\/index$/, '')
}

export function tutorialRoute(id: string): string {
	const slug = tutorialRouteSlug(id)
	return slug ? `/tutorials/${slug}/` : '/tutorials/'
}

/** Resolve entries for either the public course or a local draft preview. */
export function getVisibleTutorialEntries(
	entries: TutorialEntry[],
	visibility: TutorialVisibility = {},
): TutorialEntry[] {
	const byId = new Map(entries.map(entry => [tutorialRouteSlug(entry.id), entry]))
	if (byId.size !== entries.length) throw new Error('Duplicate normalized tutorial content ID')
	if (visibility.includeDrafts) return entries
	return entries.filter(entry => {
		if (entry.data.status !== 'published') return false
		const parts = tutorialRouteSlug(entry.id).split('/')
		for (let length = 1; length < parts.length; length++) {
			if (byId.get(parts.slice(0, length).join('/'))?.data.status === 'draft') return false
		}
		return true
	})
}

/** A draft ancestor hides its descendants, even if a child says published. */
export function getPublishedTutorialEntries(entries: TutorialEntry[]): TutorialEntry[] {
	return getVisibleTutorialEntries(entries)
}

export function getTutorialChapters(
	entries: TutorialEntry[],
	visibility: TutorialVisibility = {},
): TutorialEntry[] {
	return getVisibleTutorialEntries(entries, visibility)
		.filter(entry => entry.data.kind === 'chapter')
		.sort((a, b) => a.data.order - b.data.order)
}

export function getTutorialChapterId(id: string): string | undefined {
	return tutorialRouteSlug(id).split('/')[0] || undefined
}

export function getTutorialChapter(
	entries: TutorialEntry[],
	id: string,
	visibility: TutorialVisibility = {},
): TutorialEntry | undefined {
	return getTutorialChapters(entries, visibility).find(
		entry => tutorialRouteSlug(entry.id) === getTutorialChapterId(id),
	)
}

function chapterTree(
	entries: TutorialEntry[],
	chapter: TutorialEntry,
	visibility: TutorialVisibility = {},
): TutorialNode {
	const chapterId = tutorialRouteSlug(chapter.id)
	const root: TutorialNode = { id: chapterId, title: chapter.data.title, order: chapter.data.order, entry: chapter, items: [] }
	const nodes = new Map<string, TutorialNode>([[chapterId, root]])
	for (const entry of getVisibleTutorialEntries(entries, visibility)) {
		const id = tutorialRouteSlug(entry.id)
		if (id !== chapterId && !id.startsWith(`${chapterId}/`)) continue
		const parts = id.split('/')
		for (let length = 2; length <= parts.length; length++) {
			const prefix = parts.slice(0, length).join('/')
			if (nodes.has(prefix)) continue
			const label = branchLabels[parts[length - 1]]
			const node: TutorialNode = {
				id: prefix, title: label?.title ?? parts[length - 1].replaceAll('-', ' '),
				order: label?.order ?? 999999, items: [],
			}
			nodes.set(prefix, node)
			nodes.get(parts.slice(0, length - 1).join('/'))!.items!.push(node)
		}
		const node = nodes.get(id)!
		Object.assign(node, {
			entry, title: entry.data.sidebarLabel ?? entry.data.title,
			order: entry.data.order, href: tutorialRoute(entry.id),
		})
	}
	function sort(node: TutorialNode) {
		node.items?.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
		const orders = new Set<number>()
		for (const child of node.items ?? []) {
			if (orders.has(child.order)) throw new Error(`Duplicate tutorial sibling order below ${node.id}: ${child.order}`)
			orders.add(child.order)
			sort(child)
		}
		// Virtual groups lead to their first lesson, not to an invented index route.
		node.href ??= node.items?.[0]?.href
	}
	sort(root)
	return root
}

function flatten(node: TutorialNode): TutorialEntry[] {
	return [...(node.entry ? [node.entry] : []), ...(node.items ?? []).flatMap(flatten)]
}

export function getTutorialChapterPages(
	entries: TutorialEntry[],
	chapterId: string,
	visibility: TutorialVisibility = {},
): TutorialEntry[] {
	const chapter = getTutorialChapter(entries, chapterId, visibility)
	return chapter ? flatten(chapterTree(entries, chapter, visibility)) : []
}

/** Discovery groups stay flat; each chapter's page tree preserves arbitrary depth. */
export function getTutorialSidebar(
	entries: TutorialEntry[],
	visibility: TutorialVisibility = {},
): SidebarItem[] {
	const chapters = getTutorialChapters(entries, visibility)
	return Object.entries(groupLabels).flatMap(([group, title]) => {
		const members = chapters.filter(chapter => chapter.data.group === group)
		if (!members.length) return []
		return [
			{ id: `group-${group}`, title, order: 0, kind: 'sectionHeader' as const },
			...members.map(chapter => chapterTree(entries, chapter, visibility)),
		]
	})
}

function optional(entry: TutorialEntry) {
	return entry.data.optional || tutorialRouteSlug(entry.id).split('/').includes('extensions')
}

/** Required reading skips group indexes and extensions; optional branches stay local. */
export function getTutorialPageNavigation(
	entries: TutorialEntry[],
	currentId: string,
	visibility: TutorialVisibility = {},
) {
	const chapter = getTutorialChapter(entries, currentId, visibility)
	if (!chapter) return { previous: undefined, next: getTutorialChapters(entries, visibility)[0] }
	const pages = getTutorialChapterPages(entries, chapter.id, visibility)
	const id = tutorialRouteSlug(currentId)
	const current = pages.find(entry => tutorialRouteSlug(entry.id) === id)
	if (!current) return { previous: undefined, next: undefined }
	if (current.data.kind === 'group') {
		return { previous: chapter, next: pages.find(page => tutorialRouteSlug(page.id).startsWith(`${id}/`) && page.data.kind === 'lesson') }
	}
	const branch = id.slice(0, id.lastIndexOf('/'))
	const sequence = optional(current)
		? pages.filter(page => optional(page) && page.data.kind === 'lesson' && tutorialRouteSlug(page.id).startsWith(`${branch}/`))
		: pages.filter(page => !optional(page) && (page.data.kind === 'chapter' || page.data.kind === 'lesson'))
	const index = sequence.findIndex(page => tutorialRouteSlug(page.id) === id)
	return {
		previous: index > 0 ? sequence[index - 1] : optional(current) ? chapter : undefined,
		next: index >= 0 ? sequence[index + 1] : undefined,
	}
}

/** Include every ancestor; a virtual group is a label, never a broken link. */
export function getTutorialBreadcrumbs(
	entries: TutorialEntry[],
	currentId: string,
	visibility: TutorialVisibility = {},
) {
	const result: { title: string; href?: string }[] = [{ title: 'Tutorials', href: '/tutorials/' }]
	const parts = tutorialRouteSlug(currentId).split('/').filter(Boolean)
	const published = getVisibleTutorialEntries(entries, visibility)
	for (let length = 1; length < parts.length; length++) {
		const id = parts.slice(0, length).join('/')
		const entry = published.find(item => tutorialRouteSlug(item.id) === id)
		result.push({
			title: entry?.data.title ?? branchLabels[parts[length - 1]]?.title ?? parts[length - 1].replaceAll('-', ' '),
			href: entry ? tutorialRoute(entry.id) : undefined,
		})
	}
	return result
}
