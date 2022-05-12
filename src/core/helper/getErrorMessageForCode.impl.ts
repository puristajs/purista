import { StatusCode } from '../types'

export const getErrorMessageForCode = (code: StatusCode): string => {
  switch (code) {
    case StatusCode.BadRequest:
      return 'Bad Request'
    case StatusCode.Unauthorized:
      return 'Unauthorized'
    case StatusCode.PaymentRequired:
      return 'Payment Required'
    case StatusCode.Forbidden:
      return 'Forbidden'
    case StatusCode.NotFound:
      return 'Not Found'
    case StatusCode.MethodNotAllowed:
      return 'Method Not Allowed'
    case StatusCode.InternalServerError:
      return 'Internal Server Error'
    case StatusCode.NotImplemented:
      return 'Not Implemented'
    case StatusCode.GatewayTimeout:
      return 'Timeout'
    default:
      return 'Unspecified Error'
  }
}
