import {
	ClientBuilder,
	CommandDefinitionBuilder,
	DefaultConfigStore,
	DefaultEventBridge,
	DefaultLogger,
	DefaultSecretStore,
	DefaultStateStore,
	EBMessageType,
	HandledError,
	HttpClient,
	Service,
	ServiceBuilder,
	StatusCode,
	SubscriptionDefinitionBuilder,
	UnhandledError,
	convertToCamelCase,
	convertToKebabCase,
	convertToPascalCase,
	convertToSnakeCase,
	createErrorResponse,
	createInfoMessage,
	createSuccessResponse,
	getCleanedMessage,
	getCommandContextMock,
	getCommandErrorMessageMock,
	getCommandFunctionWithValidation,
	getCommandMessageMock,
	getCommandSuccessMessageMock,
	getCustomMessageMessageMock,
	getErrorMessageForCode,
	getEventBridgeMock,
	getLoggerMock,
	getNewCorrelationId,
	getNewEBMessageId,
	getNewTraceId,
	getSubscriptionContextMock,
	getSubscriptionFunctionWithValidation,
	getUniqueId,
	infoMessageTypes,
	initLogger,
	isCommand,
	isCommandErrorResponse,
	isCommandResponse,
	isCommandSuccessResponse,
	isInfoMessage,
	isInfoServiceFunctionAdded,
	puristaVersion,
	schemaObjectToTsType,
} from './index.js'

it('exports core functions', () => {
	expect(puristaVersion).toBeDefined()
	// core
	expect(DefaultEventBridge).toBeDefined()
	expect(DefaultLogger).toBeDefined()
	expect(createErrorResponse).toBeDefined()
	expect(createInfoMessage).toBeDefined()
	expect(createSuccessResponse).toBeDefined()
	expect(getCleanedMessage).toBeDefined()
	expect(getErrorMessageForCode).toBeDefined()
	expect(getNewCorrelationId).toBeDefined()
	expect(getNewEBMessageId).toBeDefined()
	expect(getNewTraceId).toBeDefined()
	expect(getUniqueId).toBeDefined()
	expect(infoMessageTypes).toBeDefined()
	expect(initLogger).toBeDefined()
	expect(isCommand).toBeDefined()
	expect(isCommandErrorResponse).toBeDefined()
	expect(isCommandResponse).toBeDefined()
	expect(isCommandSuccessResponse).toBeDefined()
	expect(isInfoMessage).toBeDefined()
	expect(isInfoServiceFunctionAdded).toBeDefined()
	expect(HandledError).toBeDefined()
	expect(EBMessageType).toBeDefined()
	expect(Service).toBeDefined()
	expect(StatusCode).toBeDefined()
	expect(UnhandledError).toBeDefined()

	// stores
	expect(DefaultConfigStore).toBeDefined()
	expect(DefaultSecretStore).toBeDefined()
	expect(DefaultStateStore).toBeDefined()

	// http client
	expect(HttpClient).toBeDefined()

	// helper
	expect(ServiceBuilder).toBeDefined()
	expect(CommandDefinitionBuilder).toBeDefined()
	expect(getCommandFunctionWithValidation).toBeDefined()
	expect(getSubscriptionFunctionWithValidation).toBeDefined()
	expect(SubscriptionDefinitionBuilder).toBeDefined()
	expect(convertToCamelCase).toBeDefined()
	expect(convertToKebabCase).toBeDefined()
	expect(convertToPascalCase).toBeDefined()
	expect(convertToSnakeCase).toBeDefined()

	// test helper
	expect(getCommandContextMock).toBeDefined()
	expect(getSubscriptionContextMock).toBeDefined()
	expect(getLoggerMock).toBeDefined()
	expect(getCommandContextMock).toBeDefined()
	expect(getEventBridgeMock).toBeDefined()
	expect(getCommandErrorMessageMock).toBeDefined()
	expect(getCommandMessageMock).toBeDefined()
	expect(getCommandSuccessMessageMock).toBeDefined()
	expect(getCustomMessageMessageMock).toBeDefined()

	expect(ClientBuilder).toBeDefined()
	expect(schemaObjectToTsType).toBeDefined()
})
