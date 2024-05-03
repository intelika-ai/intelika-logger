import { Emitter, LogService } from '../..'

const logService = new LogService('TestContext', {
  file: {
    path: './log.txt',
    messageFormat: 'DATE - LEVEL | CONTEXT | MESSAGE'
  }
})

logService.log('This is an info message').into(Emitter.FILE)
logService.warn('This is a warning message').into(Emitter.FILE)
logService.error('This is an error message').into(Emitter.FILE)
logService.error(new Error('This is an error message')).into(Emitter.FILE)
