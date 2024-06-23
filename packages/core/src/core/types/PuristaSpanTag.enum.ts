/**
 * Opentelemetry tags set by PURISTA framework
 */
export enum PuristaSpanTag {
	PuristaVersion = 'purista.version',
	PrincipalId = 'purista.principalId',
	TenantId = 'purista.tenantId',
	SenderServiceName = 'purista.sender.name',
	SenderServiceVersion = 'purista.sender.version',
	SenderServiceTarget = 'purista.sender.target',

	ReceiverServiceName = 'purista.receiver.name',
	ReceiverServiceVersion = 'purista.receiver.version',
	ReceiverServiceTarget = 'purista.receiver.target',

	StoreType = 'purista.store.type',
	StoreName = 'purista.store.name',
}
