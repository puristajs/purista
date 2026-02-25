export interface StreamWriter<Chunk = unknown, Final = unknown> {
	readonly cancelled: boolean
	write(chunk: Chunk): Promise<void>
	close(final?: Final): Promise<void>
	fail(error: unknown): Promise<void>
	onCancel(cb: (reason?: string) => void): void
}
