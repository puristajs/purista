import { RandomIdGenerator } from '@opentelemetry/sdk-trace-node'

const randomIdGenerator = new RandomIdGenerator()

/**
 *
 * @returns
 *
 * @group Helper
 */
export const getUniqueId = () => randomIdGenerator.generateTraceId()
