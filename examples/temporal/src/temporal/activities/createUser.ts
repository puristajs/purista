import { Context } from '@temporalio/activity'

import type { ContextWithLoggerAndEventBride } from './interceptors'

export const createUser = async (
  input: unknown,
): Promise<{
  userId: string
}> => {
  const { invoke } = Context.current() as ContextWithLoggerAndEventBride
  return invoke('User', '1', 'createUser', input, {})
}
