import { Emitter, LogService } from '../../dist'

const logService = new LogService('TestContext', {
  file: {
    path: './logs',
    includeDateInFilename: true,
    fileFormat: 'log',
    messageFormat: 'DATE - LEVEL | CONTEXT | MESSAGE'
  }
})

logService.log('This is an info message').into(Emitter.FILE)
logService.warn('This is a warning message').into(Emitter.FILE)
logService.error(new Error('This is an error message')).into(Emitter.FILE)
