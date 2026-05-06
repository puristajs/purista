const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const getApiBaseUrl = () => {
	if (!import.meta.env.DEV) {
		return ''
	}
	return (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3001'
}

export const toApiUrl = (path: string) => {
	if (isAbsoluteUrl(path)) {
		return path
	}
	const normalizedPath = path.startsWith('/') ? path : `/${path}`
	const baseUrl = getApiBaseUrl()
	return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath
}

export const runDeskMcp = async (payload: {
	name: string
	arguments?: Record<string, unknown>
}) => {
	const response = await fetch(toApiUrl('/api/v1/desk/mcp/call'), {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `HTTP ${response.status}`)
	}
	return (await response.json()) as unknown
}

export const runDeskA2a = async (payload: { prompt: string; sessionId?: string; responseFormat?: 'text' | 'json' }) => {
	const response = await fetch(toApiUrl('/api/v1/desk/a2a/call'), {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `HTTP ${response.status}`)
	}
	return (await response.json()) as unknown
}

export const getMcpTools = async () => {
	const response = await fetch(toApiUrl('/api/v1/desk/mcp/tools'), {
		method: 'GET',
		headers: { accept: 'application/json' },
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `HTTP ${response.status}`)
	}
	return (await response.json()) as unknown
}

export const loadConversationHistory = async (payload: { sessionId: string; scenario: string }) => {
	const response = await fetch(toApiUrl('/api/v1/desk/history/load'), {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `HTTP ${response.status}`)
	}
	return (await response.json()) as unknown
}

export const loadRecentConversationHistory = async (limit = 30) => {
	const response = await fetch(toApiUrl('/api/v1/desk/history/recent'), {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ limit }),
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `HTTP ${response.status}`)
	}
	return (await response.json()) as unknown
}
