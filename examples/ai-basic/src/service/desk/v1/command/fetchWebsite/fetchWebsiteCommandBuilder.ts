import { Readability } from '@mozilla/readability'
import { HandledError, StatusCode } from '@purista/core'
import { JSDOM } from 'jsdom'

import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
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

export const fetchWebsiteCommandBuilder = deskV1ServiceBuilder
	.getCommandBuilder('fetchWebsite', 'Fetches website content and converts HTML to AI-ready plain text')
	.addPayloadSchema(fetchWebsiteInputSchema)
	.addOutputSchema(fetchWebsiteOutputSchema)
	.setCommandFunction(async function (_context, payload) {
		const response = await fetch(payload.url, {
			method: 'GET',
			redirect: 'follow',
			headers: {
				accept: 'text/html,application/xhtml+xml,text/plain;q=0.9',
				'user-agent': 'purista-ai-basic/1.0',
			},
		})
		if (!response.ok) {
			throw new HandledError(StatusCode.BadGateway, `Website request failed with HTTP ${response.status}`)
		}

		const html = await response.text()
		const resolvedUrl = response.url || payload.url
		const readable = toReadableText(resolvedUrl, html)
		if (!readable.text) {
			throw new HandledError(StatusCode.BadGateway, 'Website did not return readable text content')
		}
		return {
			url: resolvedUrl,
			title: readable.title,
			text: readable.text,
		}
	})
