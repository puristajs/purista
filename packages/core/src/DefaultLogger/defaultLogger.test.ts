import type { Logger as PinoLogger } from 'pino'
import type { SinonSandbox, SinonStub } from 'sinon'
import { createSandbox } from 'sinon'

import type { Logger, LoggerOptions } from '../core/types/index.js'
import { DefaultLogger } from './DefaultLogger.impl.js'

type PinoLogStubs = {
	fatal: SinonStub
	error: SinonStub
	warn: SinonStub
	info: SinonStub
	debug: SinonStub
	trace: SinonStub
	child: SinonStub
}

describe('DefaultLogger', () => {
	let sandbox: SinonSandbox
	let mockLog: PinoLogger
	let logStubs: PinoLogStubs
	let logger: Logger

	beforeEach(() => {
		sandbox = createSandbox()
		logStubs = {
			fatal: sandbox.stub(),
			error: sandbox.stub(),
			warn: sandbox.stub(),
			info: sandbox.stub(),
			debug: sandbox.stub(),
			trace: sandbox.stub(),
			child: sandbox.stub().returnsThis(),
		}
		mockLog = logStubs as unknown as PinoLogger
		logger = new DefaultLogger(mockLog)
	})

	afterEach(() => {
		sandbox.restore()
	})

	it('should log a fatal message', () => {
		logger.fatal('fatal error')
		expect(logStubs.fatal.calledOnceWithExactly('fatal error')).toBeTruthy()
	})

	it('should log an error message', () => {
		logger.error('error message')
		expect(logStubs.error.calledOnceWithExactly('error message')).toBeTruthy()
	})

	it('should log a warning message', () => {
		logger.warn('warning message')
		expect(logStubs.warn.calledOnceWithExactly('warning message')).toBeTruthy()
	})

	it('should log an info message', () => {
		logger.info('info message')
		expect(logStubs.info.calledOnceWithExactly('info message')).toBeTruthy()
	})

	it('should log a debug message', () => {
		logger.debug('debug message')
		expect(logStubs.debug.calledOnceWithExactly('debug message')).toBeTruthy()
	})

	it('should log a trace message', () => {
		logger.trace('trace message')
		expect(logStubs.trace.calledOnceWithExactly('trace message')).toBeTruthy()
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
