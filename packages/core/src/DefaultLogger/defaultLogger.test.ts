import { createSandbox, SinonSandbox } from 'sinon'

import { Logger, LoggerOptions } from '../core/types'
import { DefaultLogger } from './DefaultLogger.impl'

describe('DefaultLogger', () => {
  let sandbox: SinonSandbox
  let mockLog: any
  let logger: Logger

  beforeEach(() => {
    sandbox = createSandbox()
    mockLog = {
      fatal: sandbox.stub(),
      error: sandbox.stub(),
      warn: sandbox.stub(),
      info: sandbox.stub(),
      debug: sandbox.stub(),
      trace: sandbox.stub(),
      child: sandbox.stub().returnsThis(),
    }
    logger = new DefaultLogger(mockLog)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should log a fatal message', () => {
    logger.fatal('fatal error')
    expect(mockLog.fatal.calledOnceWithExactly('fatal error')).toBeTruthy()
  })

  it('should log an error message', () => {
    logger.error('error message')
    expect(mockLog.error.calledOnceWithExactly('error message')).toBeTruthy()
  })

  it('should log a warning message', () => {
    logger.warn('warning message')
    expect(mockLog.warn.calledOnceWithExactly('warning message')).toBeTruthy()
  })

  it('should log an info message', () => {
    logger.info('info message')
    expect(mockLog.info.calledOnceWithExactly('info message')).toBeTruthy()
  })

  it('should log a debug message', () => {
    logger.debug('debug message')
    expect(mockLog.debug.calledOnceWithExactly('debug message')).toBeTruthy()
  })

  it('should log a trace message', () => {
    logger.trace('trace message')
    expect(mockLog.trace.calledOnceWithExactly('trace message')).toBeTruthy()
  })

  it('should get a child logger', () => {
    const childOptions: LoggerOptions = {
      serviceName: 'test-service',
      serviceVersion: '1.0.0',
      serviceTarget: 'test-target',
      name: 'test-name',
    }
    const childLogger = logger.getChildLogger(childOptions)
    expect(childLogger).toBeInstanceOf(DefaultLogger)
  })
})
