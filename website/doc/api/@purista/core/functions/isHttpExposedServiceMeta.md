[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / isHttpExposedServiceMeta

# Function: isHttpExposedServiceMeta()

> **isHttpExposedServiceMeta**(`input?`): input is \{ expose: \{ contentEncodingRequest?: string; contentEncodingResponse?: string; contentTypeRequest?: string; contentTypeResponse?: string; deprecated?: boolean; inputPayload?: SchemaObject; outputPayload?: SchemaObject; parameter?: SchemaObject \} & \{ http: \{ method: "GET" \| "POST" \| "PATCH" \| "PUT" \| "DELETE"; mode?: "sync" \| "async"; openApi?: \{ additionalStatusCodes?: StatusCode\[\]; description: string; isSecure: boolean; operationId?: string; query?: QueryParameter\<EmptyObject\>\[\]; summary: string; tags?: string\[\] \}; path: string \} \} \}

Defined in: [core/HttpServer/types/isHttpExposedServiceMeta.impl.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/HttpServer/types/isHttpExposedServiceMeta.impl.ts#L8)

Checks if given input is type of HttpExposedServiceMeta

## Parameters

### input?

`unknown`

## Returns

input is \{ expose: \{ contentEncodingRequest?: string; contentEncodingResponse?: string; contentTypeRequest?: string; contentTypeResponse?: string; deprecated?: boolean; inputPayload?: SchemaObject; outputPayload?: SchemaObject; parameter?: SchemaObject \} & \{ http: \{ method: "GET" \| "POST" \| "PATCH" \| "PUT" \| "DELETE"; mode?: "sync" \| "async"; openApi?: \{ additionalStatusCodes?: StatusCode\[\]; description: string; isSecure: boolean; operationId?: string; query?: QueryParameter\<EmptyObject\>\[\]; summary: string; tags?: string\[\] \}; path: string \} \} \}

boolean - true if input is type of HttpExposedServiceMeta
