import { type FormEvent, useState } from 'react'
import { KnowledgeChat } from './KnowledgeChat.js'

export function App() {
	const [sessionToken, setSessionToken] = useState('')
	const [error, setError] = useState('')
	const [loggingIn, setLoggingIn] = useState(false)

	async function login(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setLoggingIn(true)
		setError('')
		try {
			const response = await fetch('/api/v1/session/login', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ username: 'alex@example.test', password: 'demo-password' }),
			})
			if (!response.ok) throw new Error('The demo login failed')
			const session = (await response.json()) as { sessionToken: string }
			setSessionToken(session.sessionToken)
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : 'The demo login failed')
		} finally {
			setLoggingIn(false)
		}
	}

	return (
		<main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-5 py-10">
			<header className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">Example Bank · PURISTA RAG tutorial</p>
				<h1 className="text-3xl font-semibold tracking-tight">Ask the customer knowledge base</h1>
				<p className="max-w-2xl text-muted-foreground">
					The browser uses AI SDK UI Message Stream v1. PURISTA authenticates the request and keeps collection access on
					the server.
				</p>
			</header>
			{sessionToken ? (
				<p className="max-w-xl rounded-md border bg-muted px-4 py-3 text-sm">Signed in as Alex Example</p>
			) : (
				<form className="flex max-w-xl items-center gap-3 rounded-md border p-4" onSubmit={login}>
					<div className="flex-1 text-sm">
						<p className="font-medium">Local tutorial account</p>
						<p className="text-muted-foreground">alex@example.test · demo-password</p>
					</div>
					<button
						className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
						type="submit"
						disabled={loggingIn}
					>
						{loggingIn ? 'Signing in…' : 'Sign in'}
					</button>
				</form>
			)}
			{error ? (
				<p className="text-sm text-destructive" role="alert">
					{error}
				</p>
			) : null}
			<KnowledgeChat sessionToken={sessionToken} />
		</main>
	)
}
