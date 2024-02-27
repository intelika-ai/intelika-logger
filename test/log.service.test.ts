/// mock Logger
jest.mock('@nestjs/common')

import { OptionsWithContext } from 'lib/log/interfaces/options-Context.interface'
import { LogService } from '../lib/log/log.service'

describe('LogService', () => {
  let logService: LogService

  beforeEach(() => {
    logService = new LogService('TestContext')
  })

  it('should create an instance of LogService', () => {
    expect(logService).toBeInstanceOf(LogService)
  })

  it('should set the context correctly when initialized with a string', () => {
    expect(logService['context']).toBe('TestContext')
  })

  it('should set the context correctly when initialized with an OptionsWithContext object', () => {
    const options: OptionsWithContext = {
      context: 'TestContext'
    }
    logService = new LogService(options)
    expect(logService['context']).toBe('TestContext')
  })

  it('should log a message with the INFO severity level', () => {
    const message = logService.log('This is an info message')
    expect(message['level']).toBe('INFO')
  })

  it('should log a message with the WARN severity level', () => {
    const message = logService.warn('This is a warning message')
    expect(message['level']).toBe('WARN')
  })
})
