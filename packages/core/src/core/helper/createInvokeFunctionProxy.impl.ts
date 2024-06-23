import type { EBMessageAddress } from '../types/EBMessageAddress.js'
import type { InvokeFunction } from '../types/index.js'

const noop = () => {
	// noop
}

/**
 * Creates a proxy which allows to chain the invoke function.
 *
 * @param invokeOg the regular invoke function
 * @param address the receivers EBMessageAddress
 * @param lvl counter for recursive usage
 * @returns a proxy which allows to chain like serviceName.serviceVersion.fnToInvoke(payload,parameter)
 */
export const createInvokeFunctionProxy = <TFaux>(
	invokeOg: InvokeFunction,
	address?: EBMessageAddress,
	lvl = 0,
): TFaux => {
	const adr = {
		serviceName: '',
		serviceTarget: '',
		serviceVersion: '',
		...address,
	}

	return new Proxy(noop, {
		get(obj: Record<string, any>, name) {
			if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
				// special case for if the proxy is accidentally treated
				// like a PromiseLike (like in `Promise.resolve(proxy)`)
				return undefined
			}

			const x = obj[name]
			if (lvl === 0) {
				const na = {
					...adr,
					serviceName: name,
				}
				return createInvokeFunctionProxy<typeof x>(invokeOg, na, lvl + 1)
			}
			if (lvl === 1) {
				const na = {
					...adr,
					serviceVersion: name,
				}
				return createInvokeFunctionProxy<typeof x>(invokeOg, na, lvl + 1)
			}

			if (lvl === 2) {
				const na = {
					...adr,
					serviceTarget: name,
				}
				return (payload: Parameters<typeof x>[0], parameter: Parameters<typeof x>[1]) => {
					return invokeOg<Parameters<typeof x>[0], Parameters<typeof x>[1], ReturnType<typeof x>>(
						na,
						payload,
						parameter,
					)
				}
			}
		},
	}) as TFaux
}
