import { HandledError, HttpClient, StatusCode, UnhandledError, type Logger } from '@purista/core'
import {
	legacyTransactionProviderResponseSchema,
	type LegacyTransactionClient,
} from '../service/transaction/v1/LegacyTransactionClient.js'

export type HttpLegacyTransactionClientOptions = {
	baseUrl: string
	logger: Logger
	timeoutMs?: number
}

export class HttpLegacyTransactionClient implements LegacyTransactionClient {
	private readonly http: HttpClient

	constructor({ baseUrl, logger, timeoutMs = 750 }: HttpLegacyTransactionClientOptions) {
		this.http = new HttpClient({
			name: 'LegacyTransactionProvider',
			baseUrl,
			defaultTimeout: timeoutMs,
			logger,
		})
	}

	async fetchTransaction(sourceId: string, accessToken: string): Promise<string> {
		try {
			const response = await this.http.get<unknown>(`transactions/${encodeURIComponent(sourceId)}`, {
				headers: {
					accept: 'application/json',
					authorization: `Bearer ${accessToken}`,
				},
			})
			const parsed = legacyTransactionProviderResponseSchema.safeParse(response)
			if (!parsed.success || parsed.data.sourceId !== sourceId) {
				throw new HandledError(StatusCode.BadGateway, 'The transaction provider returned invalid data')
			}
			return parsed.data.record
		} catch (error) {
			if (error instanceof HandledError) throw error
			if (error instanceof UnhandledError && error.errorCode === StatusCode.RequestTimeout) {
				throw new HandledError(StatusCode.GatewayTimeout, 'The transaction provider timed out')
			}
			if (error instanceof UnhandledError && error.errorCode === StatusCode.NotFound) {
				throw new HandledError(StatusCode.NotFound, 'The provider transaction was not found')
			}
			throw new HandledError(StatusCode.BadGateway, 'The transaction provider request failed')
		}
	}
}
