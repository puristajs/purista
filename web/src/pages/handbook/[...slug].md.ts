import { getCollection } from 'astro:content'
import { markdownResponse, readContentMarkdown } from '../../lib/agent-markdown'
import {
	getHandbookProduct,
	getHandbookRedirectTarget,
	getProductChapterTopics,
	handbookCompatibilityAliases,
	handbookProducts,
} from '../../data/handbook'

export async function getStaticPaths() {
	const [handbook, cards] = await Promise.all([getCollection('handbook'), getCollection('handbookCards')])
	return [
		...handbookProducts.map(product => ({
			params: { slug: product.id },
			props: { product: product.id },
		})),
		...handbook.map(entry => ({
			params: { slug: entry.id.replace(/\/index$/, '') },
			props: { collection: 'handbook', entry, routeSlug: entry.id.replace(/\/index$/, '') },
		})),
		...cards.map(entry => ({ params: { slug: entry.id }, props: { collection: 'handbook-cards', entry, routeSlug: entry.id } })),
		...handbookCompatibilityAliases
			.filter(alias => alias.disposition === 'redirect')
			.map(alias => ({
				params: { slug: alias.sourceRoute.replace(/^\/handbook\//, '').replace(/\/$/, '') },
				props: {
					routeSlug: alias.sourceRoute.replace(/^\/handbook\//, '').replace(/\/$/, ''),
					redirectTarget: getHandbookRedirectTarget(alias.sourceRoute),
				},
			})),
	]
}

export async function GET({
	props,
	request,
}: {
	request: Request
	props: {
		product?: 'framework' | 'harness'
		collection?: 'handbook' | 'handbook-cards'
		routeSlug?: string
		redirectTarget?: string
		entry?: { id: string; data: { title: string; description?: string } }
	}
}) {
	if (props.product) {
		const product = getHandbookProduct(props.product)
		const chapters = getProductChapterTopics(props.product)
		return markdownResponse({
			title: product.title,
			description: product.description,
			canonicalPath: product.canonicalRoute,
			body: `## Start here\n\n${chapters.map(topic => `- [${topic.title}](${topic.canonicalRoute.replace(/\/$/, '.md')})`).join('\n')}`,
		})
	}

	const redirectTarget = props.redirectTarget ?? (props.routeSlug && getHandbookRedirectTarget(`/handbook/${props.routeSlug}/`))
	if (redirectTarget) {
		return Response.redirect(new URL(redirectTarget.replace(/\/$/, '.md'), request.url), 308)
	}
	if (!props.collection || !props.routeSlug || !props.entry) {
		throw new Error('Handbook Markdown route is missing its manifest or content entry')
	}
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
