import { defineHarness } from '@purista/harness'
import { reviewSupportActionWorkflow } from './workflow/reviewSupportAction/reviewSupportActionWorkflow.js'

export const supportHarness = defineHarness({ name: 'support-human-review' }).use(reviewSupportActionWorkflow).define()
