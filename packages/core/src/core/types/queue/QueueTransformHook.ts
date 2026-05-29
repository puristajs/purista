import type { ContextBase } from '../ContextBase.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { ServiceClass } from '../ServiceClass.js'

/**
 * Context passed to queue transform hooks.
 *
 * @group Queue
 */
export type QueueTransformContext<Resources extends Record<string, unknown> = EmptyObject> = ContextBase & {
	/** Runtime resources supplied to the service. */
	resources: Resources
}

/**
 * Hook that can normalize queue payload and parameters before enqueue or execute.
 *
 * Transform hooks run inside the service runtime, with tracing/logging
 * context, before schema-validated data crosses the next boundary.
 *
 * @group Queue
 */
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
