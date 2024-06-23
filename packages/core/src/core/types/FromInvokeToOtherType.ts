/**
 * Changes the canInvoke proxy type to given type
 *
 * serviceName.ServiceVersion.FunctionName becomes type of NewType
 */
export type FromInvokeToOtherType<Entry, NewType> = {
	[TKey in keyof Entry]: {
		[TKey2 in keyof Entry[TKey]]: {
			[TKey3 in keyof Entry[TKey][TKey2]]: NewType
		}
	}
}
