import { ErrorCode } from './ErrorCode.enum'

export type ErrorResponse = {
  status: ErrorCode
  message: string
  data?: unknown
}
