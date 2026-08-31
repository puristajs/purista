import type { CollectionEntry } from 'astro:content'
import type { SidebarItem } from '../lib/sidebar'

export type TutorialEntry = CollectionEntry<'tutorials'>

const published = (entry: TutorialEntry) => entry.data.status === 'published'
const byOrderThenTitle = (left: TutorialEntry, right: TutorialEntry) =>
	left.data.order - right.data.order || left.data.title.localeCompare(right.data.title)

/** The normalized content ID that owns the Tutorials landing route. */
export const tutorialIndexId = 'index'

/**
 * Convert a content collection ID into its canonical Tutorials URL segment.
 * Astro normalizes `chapter/index.mdx` to the ID `chapter`; `index.mdx`
 * remains the section root.
 */
export function tutorialRouteSlug(id: string): string {
	return id === tutorialIndexId ? '' : id.replace(/\/index$/, '')
}

export function tutorialRoute(id: string): string {
	const slug = tutorialRouteSlug(id)
	return slug ? `/tutorials/${slug}/` : '/tutorials/'
}

export function getPublishedTutorialEntries(entries: TutorialEntry[]): TutorialEntry[] {
	return entries.filter(published)
}

/**
 * A chapter is represented by a shallow normalized content ID. Source files
 * use `chapter/index.mdx`, while deeper `index.mdx` files remain child pages.
 * This keeps deeper page structure available without creating another sidebar
 * chapter.
 */
export function getTutorialChapters(entries: TutorialEntry[]): TutorialEntry[] {
	return getPublishedTutorialEntries(entries)
		.filter(entry => entry.id !== tutorialIndexId && !entry.id.includes('/'))
		.sort(byOrderThenTitle)
}

export function getTutorialChapterId(id: string): string | undefined {
	if (id === tutorialIndexId) return undefined
	return id.split('/')[0]
}

export function getTutorialChapter(entries: TutorialEntry[], id: string): TutorialEntry | undefined {
	const chapterId = getTutorialChapterId(id)
	return chapterId ? entries.find(entry => entry.id === chapterId && published(entry)) : undefined
}

export function getTutorialChapterPages(entries: TutorialEntry[], chapterId: string): TutorialEntry[] {
	const chapterPrefix = `${chapterId}/`
	return getPublishedTutorialEntries(entries)
		.filter(entry => entry.id === chapterId || entry.id.startsWith(chapterPrefix))
		.sort(byOrderThenTitle)
}

/**
 * Sidebar records are derived from completed content only. A future chapter
 * therefore cannot expose a broken link while its pages are still in draft.
 */
export function getTutorialSidebar(entries: TutorialEntry[]): SidebarItem[] {
	return getTutorialChapters(entries).map(chapter => {
		const chapterId = getTutorialChapterId(chapter.id)!
		return {
			title: chapter.data.sidebarLabel ?? chapter.data.title,
			id: chapter.id,
			href: tutorialRoute(chapter.id),
			order: chapter.data.order,
			items: getTutorialChapterPages(entries, chapterId)
				.filter(page => page.id !== chapter.id)
				.map(page => ({
					title: page.data.sidebarLabel ?? page.data.title,
					id: page.id,
					href: tutorialRoute(page.id),
					order: page.data.order,
				})),
		}
	})
}

export function getTutorialPageNavigation(entries: TutorialEntry[], currentId: string) {
	const chapterId = getTutorialChapterId(currentId)
	const pages = chapterId
		? getTutorialChapterPages(entries, chapterId)
		: getTutorialChapters(entries)
	const index = pages.findIndex(page => page.id === currentId)

	return {
		previous: index > 0 ? pages[index - 1] : undefined,
		next: index >= 0 && index < pages.length - 1 ? pages[index + 1] : undefined,
	}
}
