import consoleEmitter from './emitters/console.emitter'
import discordEmitter from './emitters/discord.emitter'
import telegramEmitter from './emitters/telegram.emitter'
import { Options, options } from './log.module'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'
export enum Emitter {
  'DISCORD' = 'DISCORD',
  'TELEGRAM' = 'TELEGRAM',
  'CONSOLE' = 'CONSOLE'
}

class Message {
  private level: LogLevel = 'INFO'
  private msg: any[] = []
  private _context: string
  constructor(...msg: any[]) {
    this.msg = msg
  }

  context(context: string) {
    this._context = context
    return this
  }

  is(level: LogLevel) {
    this.level = level
    return this
  }

  into(emitter: Emitter) {
    const emitters: Record<Emitter, any> = {
      CONSOLE: consoleEmitter,
      DISCORD: discordEmitter,
      TELEGRAM: telegramEmitter
    }
    const emitterFunc = emitters[emitter]
    if (!emitterFunc) {
      throw new Error('Invalid emitter')
    }

    emitterFunc(this.level, this._context, ...this.msg)

    return this
  }
}

interface OptionsWithContext extends Omit<Options, 'isGlobal'> {
  context: string
}

export class LogService {
  private context: string

  constructor(context: string | OptionsWithContext) {
    if (typeof context === 'string') {
      this.context = context
    } else {
      this.context = context.context || ''
      Object.assign(options, context)
    }
  }

  log(...msg: any[]) {
    return new Message(...msg).is('INFO').context(this.context)
  }

  warn(...msg: any[]) {
    return new Message(...msg).is('WARN').context(this.context)
  }

  error(...msg: any[]) {
    return new Message(...msg).is('ERROR').context(this.context)
  }
}
