import type { EventBridge, Service } from '@purista/core'

export interface Destroyable {
	destroy(): Promise<void>
}

export interface ProcessRuntime extends Destroyable {
	role: 'transaction' | 'monitoring' | 'reporting'
	service: Service
	eventBridge: EventBridge
}

export async function destroyInOrder(resources: Destroyable[]) {
	for (const resource of resources) await resource.destroy()
}
