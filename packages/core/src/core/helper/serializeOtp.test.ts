import { getLoggerMock } from '../../mocks'
import { deserializeOtp, serializeOtp } from './serializeOtp.impl'

describe('serializeOtp', () => {
  it('serializes opentelemetry', () => {
    const result = serializeOtp()
    expect(result).toBeDefined()
  })

  it('logs error and returns undefined JSON.parse fails', async () => {
    const logger = getLoggerMock()
    const result = deserializeOtp(logger.mock, 'wrong_input')

    expect(result).toBeUndefined()
    expect(logger.stubs.error.called).toBeTruthy()
  })
})
