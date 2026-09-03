import { getCollection } from 'astro:content'
import { markdownResponse, readContentMarkdown } from '../../lib/agent-markdown'
import { getVisibleTutorialEntries, tutorialRoute, tutorialRouteSlug } from '../../data/tutorials'

export async function getStaticPaths() {
	const entries = getVisibleTutorialEntries(await getCollection('tutorials'), {
		includeDrafts: import.meta.env.DEV,
	})
	return entries.map(entry => ({
		params: { slug: tutorialRouteSlug(entry.id) || undefined },
		props: { entry },
	}))
}

type Props = {
	entry: {
		id: string
		data: { title: string; description?: string }
	}
}

export async function GET({ props }: { props: Props }) {
	const { body, sourcePath } = await readContentMarkdown('tutorials', props.entry.id, 'auto')
	return markdownResponse({
		title: props.entry.data.title,
		description: props.entry.data.description,
		canonicalPath: tutorialRoute(props.entry.id),
		sourcePath,
		body,
	})
}
