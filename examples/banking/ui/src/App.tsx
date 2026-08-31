import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react'

type Actor = 'alice' | 'bob' | 'carol' | 'dana' | 'erin'
type AccountId = 'account-a' | 'account-c'
type LocalSession = { principalId: Actor; tenantId: 'tenant-north' }
type Transaction = {
	transactionId: string
	accountId: AccountId
	sourceTransactionId: string
	bookedAt: string
	amountMinor: number
	currency: 'EUR'
	direction: 'debit' | 'credit'
}
type Statement = { accountId: AccountId; transactions: Transaction[] }

const actorOptions: Array<{ value: Actor; label: string; detail: string }> = [
	{ value: 'alice', label: 'Alice', detail: 'Account A owner' },
	{ value: 'bob', label: 'Bob', detail: 'Read and export mandate for A' },
	{ value: 'carol', label: 'Carol', detail: 'Account C owner' },
	{ value: 'dana', label: 'Dana', detail: 'Operations posting role for A' },
	{ value: 'erin', label: 'Erin', detail: 'Investigation reviewer for A' },
]

const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' })

const request = async <T,>(path: string, init?: RequestInit): Promise<T> => {
	const response = await fetch(`/api/v1/${path}`, {
		...init,
		credentials: 'same-origin',
	})
	if (!response.ok) {
		const details = await response.text()
		throw new Error(details || `Request failed with ${response.status}`)
	}
	return response.json() as Promise<T>
}

const apiError = (error: unknown) => (error instanceof Error ? error.message : 'The request could not be completed.')
const documentCollection = (accountId: AccountId) => `${accountId}-documents`

export const App = () => {
	const [selectedActor, setSelectedActor] = useState<Actor>('alice')
	const [session, setSession] = useState<LocalSession>()
	const [accountId, setAccountId] = useState<AccountId>('account-a')
	const [statement, setStatement] = useState<Statement>()
	const [loading, setLoading] = useState(false)
	const [sessionLoading, setSessionLoading] = useState(true)
	const [error, setError] = useState<string>()
	const [notice, setNotice] = useState<string>()
	const [importing, setImporting] = useState(false)
	const [ingestingGuide, setIngestingGuide] = useState(false)
	const [question, setQuestion] = useState('')
	const chat = useChat({
		transport: useMemo(
			() =>
				new DefaultChatTransport({
					api: '/api/chat/knowledge',
					credentials: 'same-origin',
					body: () => ({ collectionId: documentCollection(accountId) }),
				}),
			[accountId],
		),
	})

	const activeActor = useMemo(
		() =>
			actorOptions.find(option => option.value === session?.principalId) ?? {
				value: selectedActor,
				label: selectedActor,
				detail: 'Not signed in',
			},
		[selectedActor, session?.principalId],
	)

	const loadTransactions = useCallback(async () => {
		if (!session) return
		setLoading(true)
		setError(undefined)
		try {
			setStatement(await request<Statement>(`accounts/${accountId}/transactions`))
		} catch (caught) {
			setStatement(undefined)
			setError(apiError(caught))
		} finally {
			setLoading(false)
		}
	}, [accountId, session])

	useEffect(() => {
		const restoreSession = async () => {
			try {
				const response = await fetch('/auth/whoami', { credentials: 'same-origin' })
				if (response.ok) setSession((await response.json()) as LocalSession)
			} finally {
				setSessionLoading(false)
			}
		}
		void restoreSession()
	}, [])

	useEffect(() => {
		if (session) void loadTransactions()
	}, [loadTransactions, session])

	const login = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setSessionLoading(true)
		setError(undefined)
		try {
			const response = await fetch('/auth/login', {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ actor: selectedActor }),
			})
			if (!response.ok) throw new Error((await response.text()) || `Login failed with ${response.status}`)
			setSession((await response.json()) as LocalSession)
			setNotice('Local session established. Protected commands now receive server-verified identity.')
		} catch (caught) {
			setError(apiError(caught))
		} finally {
			setSessionLoading(false)
		}
	}

	const logout = async () => {
		await fetch('/auth/logout', { method: 'POST', credentials: 'same-origin' })
		setSession(undefined)
		setStatement(undefined)
		setNotice('Local session ended.')
	}

	const downloadStatement = async () => {
		setError(undefined)
		setNotice(undefined)
		try {
			const response = await fetch(`/api/v1/accounts/${accountId}/statement`, { credentials: 'same-origin' })
			if (!response.ok) throw new Error((await response.text()) || `Request failed with ${response.status}`)
			const blob = new Blob([await response.text()], { type: 'text/csv' })
			const url = URL.createObjectURL(blob)
			const anchor = document.createElement('a')
			anchor.href = url
			anchor.download = `${accountId}-statement.csv`
			anchor.click()
			URL.revokeObjectURL(url)
			setNotice('The CSV statement was created by the protected PURISTA command.')
		} catch (caught) {
			setError(apiError(caught))
		}
	}

	const importLegacy = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setImporting(true)
		setError(undefined)
		setNotice(undefined)
		try {
			const transaction = await request<Transaction>('legacy/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					source_id: `ui-${Date.now()}`,
					account_ref: accountId,
					booked_at: new Date().toISOString(),
					amount: '125.40',
					currency: 'EUR',
					dc: 'D',
				}),
			})
			setNotice(`Imported ${money.format(transaction.amountMinor / 100)} as a ${transaction.direction}.`)
			await loadTransactions()
		} catch (caught) {
			setError(apiError(caught))
		} finally {
			setImporting(false)
		}
	}

	const ingestGuide = async () => {
		setIngestingGuide(true)
		setError(undefined)
		setNotice(undefined)
		try {
			await request('knowledge/documents', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					collectionId: documentCollection(accountId),
					documentId: 'ui-account-guide',
					title: `Account ${accountId} guide`,
					text: `Monthly statements explain booked transactions and balances for ${accountId}. Contact support for an account question.`,
					revision: 1,
				}),
			})
			setNotice(
				'The ingestion command accepted the guide. The local worker may need a moment before chat can retrieve it.',
			)
		} catch (caught) {
			setError(apiError(caught))
		} finally {
			setIngestingGuide(false)
		}
	}

	const askKnowledge = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const submittedQuestion = question.trim()
		if (!submittedQuestion || chat.status !== 'ready') return
		setQuestion('')
		setError(undefined)
		try {
			await chat.sendMessage({ text: submittedQuestion })
		} catch (caught) {
			setError(apiError(caught))
		}
	}

	if (sessionLoading) {
		return (
			<main className="page-shell">
				<p className="muted">Checking the local tutorial session…</p>
			</main>
		)
	}

	if (!session) {
		return (
			<main className="page-shell">
				<section className="hero" aria-labelledby="page-title">
					<p className="eyebrow">PURISTA banking tutorials</p>
					<h1 id="page-title">Example Bank</h1>
					<p>Start a local fixture session to try protected PURISTA commands.</p>
				</section>
				<form className="panel login-panel" onSubmit={login}>
					<label>
						<span>Local tutorial actor</span>
						<select value={selectedActor} onChange={event => setSelectedActor(event.target.value as Actor)}>
							{actorOptions.map(option => (
								<option key={option.value} value={option.value}>
									{option.label} — {option.detail}
								</option>
							))}
						</select>
					</label>
					<p className="muted">The server stores the selected fixture identity behind an opaque HttpOnly cookie.</p>
					<button className="button" type="submit">
						Start local session
					</button>
				</form>
				{error && (
					<div className="alert alert-error" role="alert">
						{error}
					</div>
				)}
			</main>
		)
	}

	return (
		<main className="page-shell">
			<section className="hero" aria-labelledby="page-title">
				<p className="eyebrow">PURISTA banking tutorials</p>
				<h1 id="page-title">Example Bank</h1>
				<p>Explore real PURISTA HTTP commands with a server-validated local session.</p>
			</section>

			<section className="panel controls" aria-label="Tutorial controls">
				<label>
					<span>Account</span>
					<select value={accountId} onChange={event => setAccountId(event.target.value as AccountId)}>
						<option value="account-a">Account A</option>
						<option value="account-c">Account C</option>
					</select>
				</label>
				<div className="actor-note" role="note">
					<strong>{activeActor.label}</strong>
					<span>
						{activeActor.detail} · {session.tenantId}
					</span>
				</div>
				<button type="button" className="button button-outline" onClick={() => void logout()}>
					Log out
				</button>
			</section>

			{error && (
				<div className="alert alert-error" role="alert">
					<strong>The API rejected this request.</strong>
					<span>{error}</span>
				</div>
			)}
			{notice && (
				<div className="alert alert-success" role="status">
					{notice}
				</div>
			)}

			<section className="grid" aria-label="Banking commands">
				<article className="panel">
					<div className="panel-heading">
						<div>
							<p className="eyebrow">GET command</p>
							<h2>Transactions</h2>
						</div>
						<button
							type="button"
							className="button button-outline"
							onClick={() => void loadTransactions()}
							disabled={loading}
						>
							Refresh
						</button>
					</div>
					{loading ? (
						<p className="muted">Loading protected account data…</p>
					) : statement ? (
						<TransactionTable transactions={statement.transactions} />
					) : (
						<p className="muted">Choose an actor with permission to view this account.</p>
					)}
					<button type="button" className="button button-secondary" onClick={() => void downloadStatement()}>
						Download protected CSV
					</button>
				</article>

				<article className="panel">
					<p className="eyebrow">POST command with input transform</p>
					<h2>Import a legacy transaction</h2>
					<p className="muted">
						The form sends a legacy decimal and debit/credit code. The PURISTA command validates and normalizes it
						before its business access guard runs.
					</p>
					<form onSubmit={importLegacy}>
						<dl className="preview">
							<div>
								<dt>Legacy amount</dt>
								<dd>125.40</dd>
							</div>
							<div>
								<dt>Legacy direction</dt>
								<dd>D</dd>
							</div>
							<div>
								<dt>Normalized result</dt>
								<dd>12,540 cents · debit</dd>
							</div>
						</dl>
						<button className="button" type="submit" disabled={importing}>
							{importing ? 'Importing…' : 'Import sample record'}
						</button>
					</form>
				</article>
			</section>

			<section className="panel knowledge-panel" aria-labelledby="knowledge-title">
				<div className="panel-heading">
					<div>
						<p className="eyebrow">PURISTA retrieval plus AI SDK UI</p>
						<h2 id="knowledge-title">Ask the account guide</h2>
					</div>
					<button
						type="button"
						className="button button-outline"
						onClick={() => void ingestGuide()}
						disabled={ingestingGuide}
					>
						{ingestingGuide ? 'Queueing guide…' : 'Ingest sample guide'}
					</button>
				</div>
				<p className="muted">
					The button uses the protected PURISTA ingestion command. The chat sends the selected collection and the
					server-validated session to a small AI SDK streaming transport. It only returns stored authorized excerpts; it
					does not call a live model.
				</p>
				<div className="chat-log" aria-live="polite">
					{chat.messages.length === 0 ? (
						<p className="muted">Ingest the sample guide, then ask “What does a monthly statement explain?”</p>
					) : (
						chat.messages.map(message => (
							<div className={`chat-message ${message.role}`} key={message.id}>
								<strong>{message.role === 'user' ? 'You' : 'Grounded answer'}</strong>
								{message.parts
									.filter(part => part.type === 'text')
									.map(part => (
										<p key={`${message.id}-${part.text}`}>{part.text}</p>
									))}
							</div>
						))
					)}
				</div>
				<form className="chat-form" onSubmit={askKnowledge}>
					<label>
						<span>Question about {accountId}</span>
						<textarea
							value={question}
							onChange={event => setQuestion(event.target.value)}
							placeholder="What does a monthly statement explain?"
							rows={2}
						/>
					</label>
					<button className="button" type="submit" disabled={!question.trim() || chat.status !== 'ready'}>
						{chat.status === 'streaming' || chat.status === 'submitted' ? 'Answering…' : 'Ask account guide'}
					</button>
				</form>
			</section>
			<p className="footnote">
				This local session is a learning fixture. It uses an opaque server-side session and does not model a production
				identity provider.
			</p>
		</main>
	)
}

const TransactionTable = ({ transactions }: { transactions: Transaction[] }) => (
	<div className="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Date</th>
					<th>Source</th>
					<th>Direction</th>
					<th className="amount">Amount</th>
				</tr>
			</thead>
			<tbody>
				{transactions.map(transaction => (
					<tr key={transaction.transactionId}>
						<td>{new Date(transaction.bookedAt).toLocaleDateString('en-GB')}</td>
						<td>{transaction.sourceTransactionId}</td>
						<td>
							<span className={`badge ${transaction.direction}`}>{transaction.direction}</span>
						</td>
						<td className="amount">{money.format(transaction.amountMinor / 100)}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
)
