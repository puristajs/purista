import type { EBMessageAddress } from '../types/EBMessageAddress.js'
import type { EmptyObject } from '../types/EmptyObject.js'
import type { OpenStreamFunction } from '../types/OpenStreamFunction.js'

const noop = () => {
	// noop
}

export const createOpenStreamFunctionProxy = <TFaux>(
	openStreamOg: OpenStreamFunction,
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
		get(obj: () => void, name) {
			if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
				return undefined
			}

			const x = (obj as unknown as Record<string, unknown>)[name] as (
				payload: unknown,
				parameter: EmptyObject,
			) => unknown
			if (lvl === 0) {
				const na = {
					...adr,
					serviceName: name,
				}
				return createOpenStreamFunctionProxy<typeof x>(openStreamOg, na, lvl + 1)
			}
			if (lvl === 1) {
				const na = {
					...adr,
					serviceVersion: name,
				}
				return createOpenStreamFunctionProxy<typeof x>(openStreamOg, na, lvl + 1)
			}

			if (lvl === 2) {
				const na = {
					...adr,
					serviceTarget: name,
				}
				return (payload: Parameters<typeof x>[0], parameter: Parameters<typeof x>[1]) => {
					return openStreamOg<unknown, unknown, Parameters<typeof x>[0], Parameters<typeof x>[1]>(
						na,
						payload,
						parameter,
					)
				}
			}
		},
	}) as TFaux
}
