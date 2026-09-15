import { serveStatic } from '@hono/node-server/serve-static'
import type { HonoServiceClass } from '@purista/hono-http-server'

const apiPath = (path: string) => path === '/api' || path.startsWith('/api/')

export function registerStaticWebsite(http: HonoServiceClass) {
	const indexFile = serveStatic({ path: './public/index.html' })
	http.app.use('/assets/*', serveStatic({ root: './public' }))
	http.app.get('/', indexFile)
	http.app.get('*', async (context, next) => {
		if (apiPath(context.req.path) || context.req.path === '/health') return next()
		return indexFile(context, next)
	})
}
