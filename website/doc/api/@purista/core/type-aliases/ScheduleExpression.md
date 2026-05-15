[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ScheduleExpression

# Type Alias: ScheduleExpression

> **ScheduleExpression** = \{ `kind`: `"cron"`; `timezone?`: `string`; `value`: `string`; \} \| \{ `everyMs`: `number`; `kind`: `"interval"`; \} \| \{ `kind`: `"oneShot"`; `runAt`: `string` \| `number` \| `Date`; \}

Defined in: [core/types/schedule/ScheduleDefinition.ts:3](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L3)
