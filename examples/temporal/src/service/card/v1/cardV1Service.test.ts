import { cardV1Service as service } from './cardV1Service.js'

describe('service card version 1', () => {
  it('has valid setup', async () => {
    await expect(service.testServiceSetup()).resolves.toBeTruthy()
  })
})
