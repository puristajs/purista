import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const accountV1CreateAccountInputParameterSchema = extendApi(z.object({}), {
	title: 'createAccount input parameter schema',
})

// define the input payload
export const accountV1CreateAccountInputPayloadSchema = extendApi(z.any(), {
	title: 'createAccount input payload schema',
})

// define the output payload
export const accountV1CreateAccountOutputPayloadSchema = extendApi(z.any(), {
	title: 'createAccount output payload schema',
})
