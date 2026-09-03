type ClosableNodeServer = { close(callback: (error?: Error) => void): unknown }

export function createNodeHttpListener(server: ClosableNodeServer) {
	return {
		name: 'nodeHttpListener',
		destroy: () => new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
	}
}
