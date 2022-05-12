import { StatusCode } from './StatusCode.enum'

export type ErrorResponse = {
  status: StatusCode
  message: string
  data?: unknown
}
