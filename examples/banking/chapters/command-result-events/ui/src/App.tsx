import { AlertCircle, Building2, CloudDownload, FileDown, Landmark, LogIn, LogOut, Radio, ReceiptText, UserRound } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Alert } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type BankProfile = { name: string; currency: string }
type Session = { principalId: string; tenantId: string; displayName: string; expiresAt: number }
type LoginResult = { sessionToken: string; displayName: string; expiresAt: number }
type Transaction = { transactionId: string; accountId: string; amountCents: number }

export function App() {
	const [profile, setProfile] = useState<BankProfile>()
	const [profileError, setProfileError] = useState(false)
	const [sessionToken, setSessionToken] = useState<string>()
	const [session, setSession] = useState<Session>()
	const [authError, setAuthError] = useState<string>()
	const [result, setResult] = useState<Transaction>()
	const [submitError, setSubmitError] = useState<string>()
	const [csv, setCsv] = useState<string>()

	useEffect(() => {
		fetch('/api/v1/profile')
			.then(async response => {
				if (!response.ok) throw new Error('profile failed')
				return response.json() as Promise<BankProfile>
			})
			.then(setProfile)
			.catch(() => setProfileError(true))
	}, [])

	async function login(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setAuthError(undefined)
		const data = new FormData(event.currentTarget)
		const response = await fetch('/api/v1/session/login', {
			method: 'POST', headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username: data.get('username'), password: data.get('password') }),
		})
		if (!response.ok) { setAuthError('The local credentials were rejected.'); return }
		const created = (await response.json()) as LoginResult
		const current = await fetch('/api/v1/session', {
			headers: { authorization: `Bearer ${created.sessionToken}` },
		})
		if (!current.ok) { setAuthError('The new session could not be resolved.'); return }
		setSessionToken(created.sessionToken)
		setSession((await current.json()) as Session)
	}

	async function logout() {
		if (sessionToken) await fetch('/api/v1/session', {
			method: 'DELETE', headers: { authorization: `Bearer ${sessionToken}` },
		})
		setSessionToken(undefined); setSession(undefined); setResult(undefined); setCsv(undefined)
	}

	async function importLegacyTransaction(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!sessionToken) return
		setSubmitError(undefined); setResult(undefined); setCsv(undefined)
		const data = new FormData(event.currentTarget)
		const accountId = String(data.get('accountId'))
		const response = await fetch(`/api/v1/accounts/${accountId}/transactions/import`, {
			method: 'POST',
			headers: { 'content-type': 'text/plain; charset=utf-8', authorization: `Bearer ${sessionToken}` },
			body: String(data.get('record')),
		})
		if (response.status === 401) {
			setSessionToken(undefined); setSession(undefined); setSubmitError('Your session expired. Log in again.'); return
		}
		if (response.status === 403) {
			setSubmitError('You are signed in, but this account action is not allowed.'); return
		}
		if (!response.ok) { setSubmitError('The legacy record was rejected.'); return }
		setResult((await response.json()) as Transaction)
	}

	async function importProviderTransaction(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!sessionToken) return
		setSubmitError(undefined); setResult(undefined); setCsv(undefined)
		const data = new FormData(event.currentTarget)
		const accountId = String(data.get('accountId'))
		const sourceId = String(data.get('sourceId'))
		const response = await fetch(
			`/api/v1/accounts/${accountId}/transactions/provider/${encodeURIComponent(sourceId)}/import`,
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json; charset=utf-8',
					authorization: `Bearer ${sessionToken}`,
				},
				body: '{}',
			},
		)
		if (response.status === 401) {
			setSessionToken(undefined); setSession(undefined); setSubmitError('Your session expired. Log in again.'); return
		}
		if (response.status === 403) {
			setSubmitError('You are signed in, but this account action is not allowed.'); return
		}
		if (!response.ok) { setSubmitError('The external provider could not supply this transaction.'); return }
		setResult((await response.json()) as Transaction)
	}

	async function exportTransaction() {
		if (!sessionToken || !result) return
		setSubmitError(undefined); setCsv(undefined)
		const response = await fetch(
			`/api/v1/accounts/${result.accountId}/transactions/${result.transactionId}/export`,
			{ headers: { authorization: `Bearer ${sessionToken}` } },
		)
		if (response.status === 403) { setSubmitError('You are signed in, but this account action is not allowed.'); return }
		if (!response.ok) { setSubmitError('The CSV export failed.'); return }
		setCsv(await response.text())
	}

	return <div className="min-h-screen bg-background text-foreground">
		<header className="border-b bg-card/80"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
			<a className="flex items-center gap-3 font-semibold" href="/" aria-label="Example Bank home"><span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Landmark className="size-5" /></span>Example Bank</a>
			<a className={buttonVariants({ variant: 'outline', size: 'sm' })} href="/api/openapi.json">API contract</a>
		</div></header>
		<main className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.8fr_1.2fr]">
			<section className="space-y-5" aria-labelledby="welcome-title">
				<div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground"><Radio className="size-3.5 text-emerald-600" /> PURISTA application online</div>
				<h1 id="welcome-title" className="text-4xl font-semibold tracking-tight sm:text-5xl">Commands receive external clients as typed resources.</h1>
				<Card aria-label="Public bank profile"><CardHeader><CardDescription>Public profile</CardDescription>{!profile && !profileError ? <Skeleton className="h-7 w-44" aria-label="Loading public profile" /> : null}{profile ? <CardTitle className="flex items-center gap-2"><Building2 className="size-5" />{profile.name}</CardTitle> : null}</CardHeader><CardContent>{profile ? <p className="text-2xl font-semibold">{profile.currency}</p> : null}{profileError ? <Alert>The public profile is unavailable.</Alert> : null}</CardContent></Card>
			</section>
			<div className="space-y-6">
				<Card><CardHeader><CardDescription>Identity commands</CardDescription><CardTitle className="flex items-center gap-2"><UserRound className="size-5" /> Session</CardTitle></CardHeader><CardContent>
					{session ? <div className="flex items-center justify-between gap-4"><div><p className="font-medium">{session.displayName}</p><p className="text-sm text-muted-foreground">Signed in for {session.tenantId}</p></div><Button variant="outline" onClick={logout}><LogOut className="size-4" /> Log out</Button></div> : <form className="grid gap-4" aria-label="Local login" onSubmit={login}><label className="grid gap-2 text-sm font-medium">Username<input className="h-10 rounded-md border bg-background px-3 font-normal" name="username" defaultValue="alex@example.test" autoComplete="username" /></label><label className="grid gap-2 text-sm font-medium">Password<input className="h-10 rounded-md border bg-background px-3 font-normal" name="password" type="password" defaultValue="demo-password" autoComplete="current-password" /></label><Button type="submit"><LogIn className="size-4" /> Log in</Button></form>}
					{authError ? <Alert><AlertCircle className="size-4" /> {authError}</Alert> : null}
				</CardContent></Card>
				<Card><CardHeader><CardDescription>Transforms and external resources</CardDescription><CardTitle className="flex items-center gap-2"><ReceiptText className="size-5" /> Import a transaction</CardTitle></CardHeader><CardContent>
					{session ? <form className="grid gap-4" onSubmit={importLegacyTransaction} aria-label="Import legacy transaction"><label className="grid gap-2 text-sm font-medium">Account<select className="h-10 rounded-md border bg-background px-3 font-normal" name="accountId"><option value="account-operating">Operating account</option><option value="account-review">Review account</option></select></label><label className="grid gap-2 text-sm font-medium">Legacy text record<textarea className="min-h-24 rounded-md border bg-background p-3 font-mono text-sm font-normal" name="record" defaultValue="debit|25.99|Northwind Books|Order 1042" /></label><Button type="submit">Import text record</Button></form> : <p className="text-sm text-muted-foreground">Log in to call protected commands.</p>}
					{session ? <form className="mt-6 grid gap-4 border-t pt-6" onSubmit={importProviderTransaction} aria-label="Import provider transaction"><div><p className="font-medium">External provider</p><p className="text-sm text-muted-foreground">The command receives the provider client and repository from PURISTA.</p></div><label className="grid gap-2 text-sm font-medium">Account<select className="h-10 rounded-md border bg-background px-3 font-normal" name="accountId"><option value="account-operating">Operating account</option><option value="account-review">Review account</option></select></label><label className="grid gap-2 text-sm font-medium">Provider record ID<input className="h-10 rounded-md border bg-background px-3 font-mono font-normal" name="sourceId" defaultValue="provider-1001" /></label><Button type="submit" variant="outline"><CloudDownload className="size-4" /> Import from provider</Button></form> : null}
					{submitError ? <Alert>{submitError}</Alert> : null}
					{result ? <div className="mt-4 rounded-lg border bg-muted/40 p-4" aria-live="polite"><p className="text-sm text-muted-foreground">Imported transaction for {result.accountId}</p><p className="font-mono text-sm">{result.transactionId}</p><p className="mt-2 text-2xl font-semibold">{result.amountCents} cents</p><Button className="mt-4" variant="outline" onClick={exportTransaction}><FileDown className="size-4" /> Export as CSV</Button></div> : null}
					{csv ? <pre className="mt-4 overflow-x-auto rounded-lg border bg-slate-950 p-4 text-xs text-slate-50" aria-label="CSV export">{csv}</pre> : null}
				</CardContent></Card>
			</div>
		</main>
	</div>
}
