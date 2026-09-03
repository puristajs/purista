---
title: Create and validate a stream
description: Generate and register a stream definition, make its public contracts explicit, and implement the service-bound writer handler.
order: 341
---

Finish this page with a registered stream whose chunks and final result have
clear contracts. A stream belongs to a versioned service; the service registers
it with a stream-capable EventBridge.

## Generate and review the definition

```bash title="Generate the document-analysis stream"
npm run add:stream -- analyze-document --description "Stream document analysis progress" --service document --service-version 1
```

The generator creates types, schemas, a builder, a test, and service aggregate
registration. Replace its permissive initial schemas before exposing the
stream. Keep chunks and final values small: do not stream raw documents,
credentials, or unredacted personal data.

## Define the public contracts

```ts title="src/service/document/v1/stream/analyzeDocument/analyzeDocumentStreamBuilder.ts"
import { documentV1ServiceBuilder } from '../../documentV1ServiceBuilder.js'
import {
  documentV1AnalyzeDocumentChunkPayloadSchema,
  documentV1AnalyzeDocumentFinalPayloadSchema,
  documentV1AnalyzeDocumentInputParameterSchema,
  documentV1AnalyzeDocumentInputPayloadSchema,
} from './schema.js'

export const analyzeDocumentStreamBuilder = documentV1ServiceBuilder
  .getStreamBuilder('analyzeDocument', 'Stream document analysis progress')
  .addPayloadSchema(documentV1AnalyzeDocumentInputPayloadSchema)
  .addParameterSchema(documentV1AnalyzeDocumentInputParameterSchema)
  .addChunkSchema(documentV1AnalyzeDocumentChunkPayloadSchema)
  .addFinalSchema(documentV1AnalyzeDocumentFinalPayloadSchema)
  .setStreamFunction(async function (_context, payload, _parameter, writer) {
    await writer.write({ stage: 'extracting', progress: 25 })
    if (writer.cancelled) return
    await writer.close({ documentId: payload.documentId, status: 'complete' })
  })
```

`setStreamFunction` requires `async function (context, payload, parameter,
writer)`. It rejects an arrow function because the runtime binds `this` to the
service instance. A handler return value has no stream-output meaning; use the
writer.

## Know what each method guarantees

| Method | Parameters/defaults | What it does |
| --- | --- | --- |
| [`getStreamBuilder(name, description, finalEventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getstreambuilder) | Stream name, description, optional initial final-event name | Creates a service-owned definition. |
| [`addPayloadSchema(schema, contentType?, encoding?)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addpayloadschema) | Input schema and optional media metadata | Types handler input and describes the open request; it is not universal receiver-side validation. |
| [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addparameterschema) | Parameter schema | Types/metadata for the separate open parameter; same validation boundary applies. |
| [`addChunkSchema(schema, validateChunks = true)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addchunkschema) | Chunk schema and producer-output validation switch | Types `writer.write`; validates each chunk by default. |
| [`addFinalSchema(schema, validateFinal = true)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addfinalschema) | Final schema and producer-output validation switch | Types `writer.close`; validates the final value by default. |
| [`setBeforeGuardHooks(hooks)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setbeforeguardhooks) | Named functions | Merges hooks and runs them in parallel before the handler. |
| [`setAfterGuardHooks(hooks)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setafterguardhooks) | Named functions | Merges hooks and runs them in parallel after the writer closes and any declared final schema validates. With aggregation disabled, an implicit close can pass `undefined`; do not assume this hook always receives a business final value. |
| [`setStreamFunction(fn)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setstreamfunction) | Service-bound non-arrow handler | Installs the required implementation. |

[`getStreamFunction()`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#getstreamfunction)
returns that raw handler. Unlike command and subscription builders, a stream
builder has no validating wrapper or `getStreamFunctionPlain()` pair. Chunk and
final validation live in the runtime writer, so a direct call to
`getStreamFunction()` does not prove either contract.

The remaining public methods have focused owners:

| Capability | Methods | Guide |
| --- | --- | --- |
| Completion | `enableChunkAggregation`, `setFinalEventName` | [Write chunks and complete the stream](/handbook/framework/build-services/streams/write-chunks-and-complete/) |
| Dependencies | `canInvoke`, `canConsumeStream`, `canEnqueue`, `canEmit` | [Invoke, enqueue, emit, and consume](/handbook/framework/build-services/streams/invoke-enqueue-emit-and-consume/) |
| HTTP/OpenAPI | `exposeAsHttpStreamEndpoint`, `setHttpStreamingMode`, `setHttpStreamProtocol`, `setHttpResponseHeaders`, `makeEndpointPublic`, `enableHttpSecurity`, `setOpenApiSummary`, `addOpenApiTags`, `setOpenApiOperationId`, `addOpenApiErrorStatusCodes`, `addQueryParameters` | [Expose a stream](/handbook/framework/build-services/streams/expose-a-stream/) |
| Inspection/evolution | [`getBeforeGuardHook(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#getbeforeguardhook), [`getAfterGuardHook(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#getafterguardhook), [`markAsDeprecated()`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#markasdeprecated), [`getDefinition()`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#getdefinition) | Retrieve one hook for a focused test, publish deprecation metadata, or materialize the complete definition for service registration. None starts a stream. |

The payload/parameter schemas do not currently validate inbound values in
`Service.executeStream` or Hono before guards and the handler. They remain a
valuable contract, but do not write the handler as if that boundary were
already enforced. The caller-side `canConsumeStream` contract does validate its
declared request schemas.

## Register and verify

Add `analyzeDocumentStreamBuilder.getDefinition()` to the service aggregate,
start it with `DefaultEventBridge`, and capture a first ordered result with the
[stream test harness](/handbook/framework/build-services/streams/test-a-stream/).

Next, [write chunks and complete the stream](/handbook/framework/build-services/streams/write-chunks-and-complete/) or declare [outbound capabilities](/handbook/framework/build-services/streams/invoke-enqueue-emit-and-consume/).

For the complete API, see [StreamDefinitionBuilder](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/).
