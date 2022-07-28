import { TraceId } from './TraceId'

export type MetricEntry = {
  /** metric name */
  name: string
  /** start timestamp in ms */
  startTime: number
  /** end timestamp in ms */
  endTime: number
  /** total duration in ms */
  duration: number
  /** trace id */
  traceId: TraceId
  /** name of function or subscription */
  functionName: string
}
