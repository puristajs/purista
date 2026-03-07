import { Readability } from '@mozilla/readability'
import { HandledError, HttpClient, StatusCode } from '@purista/core'
import { JSDOM } from 'jsdom'

import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { fetchWebsiteInputSchema, fetchWebsiteOutputSchema } from './schema.js'

const toReadableText = (url: string, html: string): { title?: string; text: string } => {
	const dom = new JSDOM(html, { url })
	const reader = new Readability(dom.window.document)
	const article = reader.parse()
	if (!article?.textContent?.trim()) {
		const fallbackText = dom.window.document.body?.textContent?.replace(/\s+/g, ' ').trim()
		return {
			title: dom.window.document.title || undefined,
			text: fallbackText ?? '',
		}
	}
	return {
		title: article.title || undefined,
		text: article.textContent.replace(/\s+/g, ' ').trim(),
	}
}

export const fetchWebsiteCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('fetchWebsite', 'Fetches website content and converts HTML to AI-ready plain text')
	.addPayloadSchema(fetchWebsiteInputSchema)
	.addOutputSchema(fetchWebsiteOutputSchema)
	.setCommandFunction(async function (context, payload) {
		const targetUrl = new URL(payload.url)
		const client = new HttpClient({
			baseUrl: `${targetUrl.protocol}//${targetUrl.host}`,
			logger: context.logger,
		})
		const html = await client.get<string>(`${targetUrl.pathname}${targetUrl.search}`, {
			headers: {
				accept: 'text/html,application/xhtml+xml',
				'user-agent': 'purista-ai-basic/1.0',
			},
		})
		const readable = toReadableText(payload.url, html)
		if (!readable.text) {
			throw new HandledError(StatusCode.BadGateway, 'Website did not return readable text content')
		}
		return {
			url: payload.url,
			title: readable.title,
			text: readable.text,
		}
	})
