import { describe, expect, test } from 'vitest'
import {
	getPublishedTutorialEntries,
	getTutorialBreadcrumbs,
	getTutorialPageNavigation,
	getTutorialSidebar,
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
