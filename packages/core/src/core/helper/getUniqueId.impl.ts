import { RandomIdGenerator } from '@opentelemetry/sdk-trace-node'

const randomIdGenerator = new RandomIdGenerator()
export const getUniqueId = () => randomIdGenerator.generateTraceId()
