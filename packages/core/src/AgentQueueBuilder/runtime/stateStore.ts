import type { StateStore } from '@purista/harness'
import { InMemoryStateStore } from '@purista/harness'

export function createPuristaHarnessStateStore(store?: StateStore): StateStore {
	return store ?? new InMemoryStateStore()
}
