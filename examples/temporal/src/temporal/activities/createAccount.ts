import { Context } from '@temporalio/activity'

import type { ContextWithLoggerAndEventBride } from './interceptors'

export async function createAccount(input: unknown): Promise<{
  accountId: string
}> {
  const { invoke } = Context.current() as ContextWithLoggerAndEventBride
  return invoke('Account', '1', 'createAccount', input, {})
}
