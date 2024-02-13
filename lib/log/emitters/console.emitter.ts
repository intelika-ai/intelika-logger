import { Logger } from '@nestjs/common'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

const consoleEmitter = (level: LogLevel, context: string, ...msg: any[]) => {
  const nestLogger = new Logger(context)
  const msgFormatted = msg.map(m => (typeof m === 'object' ? JSON.stringify(m) : m.toString())).join(' ')
  nestLogger[level.toLowerCase().replace('info', 'log')](msgFormatted)
}
export default consoleEmitter
