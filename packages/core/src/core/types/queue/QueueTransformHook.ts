import type { ContextBase } from '../ContextBase.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { ServiceClass } from '../ServiceClass.js'

export type QueueTransformContext<Resources extends Record<string, unknown> = EmptyObject> = ContextBase & {
	resources: Resources
}

export type QueueTransformHook<
	S extends ServiceClass = ServiceClass,
	Payload = unknown,
	Params = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
> = (
	this: S,
	context: QueueTransformContext<Resources>,
	payload: Readonly<Payload>,
	parameter: Readonly<Params | undefined>,
) => Promise<{ payload: Payload; parameter?: Params }>
