export type QueueHandlerResult =
	| { status: 'success'; output?: unknown; headers?: Record<string, string> }
	| { status: 'retry'; reason?: string; delayMs?: number }
	| { status: 'fail'; reason: string; fatal?: boolean; delayMs?: number }
