import { describe, expect, it } from 'vitest'

import {
	extractInputPartFromMessagePart,
	extractLatestUserMessageInputParts,
	extractLatestUserMessageText,
	extractTextFromMessagePart,
} from './messageText.js'

describe('message text helpers', () => {
	it('extracts text from supported message parts', () => {
		expect(extractTextFromMessagePart(undefined)).toBe('')
		expect(extractTextFromMessagePart({ type: 'text', text: 'hello' })).toBe('hello')
		expect(extractTextFromMessagePart({ type: 'input_text', text: 'world' })).toBe('world')
		expect(extractTextFromMessagePart({ text: 'fallback' })).toBe('fallback')
	})

	it('extracts supported multimodal input parts from message parts', () => {
		expect(extractInputPartFromMessagePart({ type: 'text', text: 'hello' })).toEqual({
			type: 'text',
			text: 'hello',
		})
		expect(
			extractInputPartFromMessagePart({
				type: 'image',
				image: new URL('https://example.com/mockup.png'),
				mediaType: 'image/png',
			}),
		).toEqual({
			type: 'image',
			image: new URL('https://example.com/mockup.png'),
			mediaType: 'image/png',
		})
		expect(
			extractInputPartFromMessagePart({
				type: 'file',
				data: new URL('https://example.com/brief.pdf'),
				mediaType: 'application/pdf',
				filename: 'brief.pdf',
			}),
		).toEqual({
			type: 'file',
			data: new URL('https://example.com/brief.pdf'),
			mediaType: 'application/pdf',
			filename: 'brief.pdf',
		})
	})

	it('prefers the top-level message field when present', () => {
		expect(
			extractLatestUserMessageText({
				message: 'Top level',
				messages: [{ role: 'user', content: 'ignored' }],
			}),
		).toBe('Top level')
	})

	it('extracts the latest user content string from messages', () => {
		expect(
			extractLatestUserMessageText({
				messages: [
					{ role: 'assistant', content: 'hi' },
					{ role: 'user', content: 'latest user message' },
				],
			}),
		).toBe('latest user message')
	})

	it('extracts text from user message parts', () => {
		expect(
			extractLatestUserMessageText({
				messages: [
					{
						role: 'user',
						parts: [
							{ type: 'text', text: 'hello ' },
							{ type: 'input_text', text: 'world' },
						],
					},
				],
			}),
		).toBe('hello world')
	})

	it('returns an empty string for invalid payloads', () => {
		expect(extractLatestUserMessageText({})).toBe('')
		expect(
			extractLatestUserMessageText({
				messages: [{ role: 'assistant', content: 'no user message' }],
			}),
		).toBe('')
	})

	it('extracts the latest user input parts from messages', () => {
		expect(
			extractLatestUserMessageInputParts({
				messages: [
					{
						role: 'assistant',
						parts: [{ type: 'text', text: 'ignore' }],
					},
					{
						role: 'user',
						parts: [
							{ type: 'text', text: 'describe this' },
							{
								type: 'image',
								image: new URL('https://example.com/mockup.png'),
								mediaType: 'image/png',
							},
						],
					},
				],
			}),
		).toEqual([
			{
				type: 'text',
				text: 'describe this',
			},
			{
				type: 'image',
				image: new URL('https://example.com/mockup.png'),
				mediaType: 'image/png',
			},
		])
	})
})
