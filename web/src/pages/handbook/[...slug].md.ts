import { getCollection } from 'astro:content'
import { markdownResponse, readContentMarkdown } from '../../lib/agent-markdown'

export async function getStaticPaths() {
	const [handbook, cards] = await Promise.all([getCollection('handbook'), getCollection('handbookCards')])
	return [
		...handbook.map(entry => ({
			params: { slug: entry.id.replace(/\/index$/, '') },
			props: { collection: 'handbook', entry, routeSlug: entry.id.replace(/\/index$/, '') },
		})),
		...cards.map(entry => ({ params: { slug: entry.id }, props: { collection: 'handbook-cards', entry, routeSlug: entry.id } })),
	]
}

export async function GET({
	props,
}: {
	props: {
		collection: 'handbook' | 'handbook-cards'
		routeSlug: string
		entry: { id: string; data: { title: string; description?: string } }
	}
}) {
	const extension = props.collection === 'handbook-cards' ? 'mdx' : 'md'
	const { body, sourcePath } = await readContentMarkdown(props.collection, props.entry.id, extension)
	return markdownResponse({
		title: props.entry.data.title,
		description: props.entry.data.description,
		canonicalPath: `/handbook/${props.routeSlug}/`,
		sourcePath,
		body,
	})
}
