import type { EventBridge } from '@purista/core'
import { Context } from '@temporalio/activity'

// a small get which returns the invoke function
export const getInvoke =
  (eventBridge: EventBridge) =>
  async <Output = unknown>(
    serviceName: string,
    serviceVersion: string,
    serviceTarget: string,
    payload: unknown,
    parameter = {},
  ): Promise<Output> => {
    const ctx = Context.current()
    return eventBridge.invoke<Output>({
      sender: {
        serviceName: ctx.info.workflowType,
        serviceVersion: '1',
        serviceTarget: ctx.info.activityType,
        instanceId: eventBridge.instanceId,
      },
      receiver: {
        serviceName,
        serviceVersion,
        serviceTarget,
      },
      payload: {
        payload,
        parameter,
      },
      contentEncoding: 'application/json',
      contentType: 'utf-8',
    })
  }
