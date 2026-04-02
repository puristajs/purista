[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ConversationHelpers

# Type Alias: ConversationHelpers

> **ConversationHelpers** = `object`

Defined in: [packages/ai/src/runtime/conversation.ts:31](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L31)

## Methods

### addAssistant()

> **addAssistant**(`content`, `options?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:48](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L48)

#### Parameters

##### content

`string`

##### options?

###### metadata?

`Record`\<`string`, `unknown`\>

###### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>

***

### addDeveloper()

> **addDeveloper**(`content`, `options?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:40](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L40)

#### Parameters

##### content

`string`

##### options?

###### metadata?

`Record`\<`string`, `unknown`\>

###### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>

***

### addSystem()

> **addSystem**(`content`, `options?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:36](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L36)

#### Parameters

##### content

`string`

##### options?

###### metadata?

`Record`\<`string`, `unknown`\>

###### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>

***

### addTool()

> **addTool**(`content`, `options?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:52](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L52)

#### Parameters

##### content

`string`

##### options?

###### metadata?

`Record`\<`string`, `unknown`\>

###### sessionId?

`string`

###### toolCallId?

`string`

###### toolName?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>

***

### addToolResult()

> **addToolResult**(`content`, `options?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:56](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L56)

#### Parameters

##### content

`string`

##### options?

###### metadata?

`Record`\<`string`, `unknown`\>

###### sessionId?

`string`

###### toolCallId?

`string`

###### toolName?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>

***

### addUser()

> **addUser**(`content`, `options?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:44](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L44)

#### Parameters

##### content

`string`

##### options?

###### metadata?

`Record`\<`string`, `unknown`\>

###### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>

***

### append()

> **append**(`message`, `sessionId?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:35](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L35)

#### Parameters

##### message

`Omit`\<[`ConversationMessage`](ConversationMessage.md), `"id"` \| `"createdAt"`\>

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>

***

### buildPromptInput()

> **buildPromptInput**(`options?`): `Promise`\<`string`\>

Defined in: [packages/ai/src/runtime/conversation.ts:62](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L62)

#### Parameters

##### options?

###### includeSummary?

`boolean`

###### sessionId?

`string`

#### Returns

`Promise`\<`string`\>

***

### get()

> **get**(`sessionId?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:32](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L32)

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>

***

### getMessages()

> **getMessages**(`sessionId?`): `Promise`\<[`ConversationMessage`](ConversationMessage.md)[]\>

Defined in: [packages/ai/src/runtime/conversation.ts:33](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L33)

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationMessage`](ConversationMessage.md)[]\>

***

### getSummary()

> **getSummary**(`sessionId?`): `Promise`\<`string` \| `undefined`\>

Defined in: [packages/ai/src/runtime/conversation.ts:34](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L34)

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<`string` \| `undefined`\>

***

### revertLast()

> **revertLast**(`options?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:61](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L61)

#### Parameters

##### options?

###### role?

[`ConversationRole`](ConversationRole.md)

###### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>

***

### setSummary()

> **setSummary**(`summary`, `sessionId?`): `Promise`\<[`ConversationState`](ConversationState.md)\>

Defined in: [packages/ai/src/runtime/conversation.ts:60](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/conversation.ts#L60)

#### Parameters

##### summary

`string`

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationState`](ConversationState.md)\>
