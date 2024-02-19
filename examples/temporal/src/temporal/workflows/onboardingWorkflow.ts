import { propagation } from '@opentelemetry/api'
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core'
import { condition, defineSignal, proxyActivities, setHandler } from '@temporalio/workflow'

import type { ActivitiesType } from '../worker.js'

propagation.setGlobalPropagator(
  new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
  }),
)

const { createAccount, validate, sendEmailVerification, createUser } = proxyActivities<ActivitiesType>({
  startToCloseTimeout: '1 minute',
})

const emailVerifiedSignal = defineSignal('signal-email-verified')

/** A workflow that simply calls an activity */
export async function onboardingWorkflow(input: unknown): Promise<void> {
  const register = await validate(input)

  await sendEmailVerification(register.email)

  let isEmailVerified = false
  setHandler(emailVerifiedSignal, async () => {
    isEmailVerified = true
  })

  await condition(() => isEmailVerified, '60 minutes')

  const user = await createUser(register)
  const _account = await createAccount(user)
  // const card = await issueCardForAccount(account)
}
