import { Context } from '@temporalio/activity'

import type { ContextWithLoggerAndEventBride } from './interceptors'

export const sendEmailVerification = (email: string): Promise<void> => {
  const { invoke } = Context.current() as ContextWithLoggerAndEventBride
  return invoke('Email', '1', 'sendVerificationEmail', { email }, {})
}
