import consoleEmitter from './emitters/console.emitter'
import discordEmitter from './emitters/discord.emitter'
import telegramEmitter from './emitters/telegram.emitter'
import { OptionsWithContext } from './interfaces/options-Context.interface'
import { setOptions } from './options'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

/**
 * @enum Emitter
 * Enum representing different emitters for logging.
 * @example
 * const emitter = Emitter.DISCORD
 */
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

/**
 * @class LogService
 * Represents a logging service that provides methods for logging messages with different severity levels.
 * @example
 * const logger = new LogService('MyContext')
 * logger.log('This is an info message').into(Emitter.CONSOLE)
 */
export class LogService {
  private context: string

  /**
   * Creates a new instance of the LogService.
   * @constructor
   * @param { string | OptionsWithContext } context - The context for the logger service.
   * @example
   * const logger = new LogService('MyContext')
   * logger.log('This is an info message').into(Emitter.CONSOLE)
   */
  constructor(context: string | OptionsWithContext) {
    if (typeof context === 'string') {
      this.context = context
    } else {
      this.context = context.context || ''
      setOptions(context)
    }
  }

  /**
   * @method log
   * Logs a message with the 'INFO' severity level.
   * @param msg - The message to be logged.
   * @returns A Message object with the specified message, severity level set to 'INFO', and the current context.
   */
  log(...msg: any[]) {
    return new Message(...msg).is('INFO').context(this.context)
  }

  /**
   * @method warn
   * Logs a message with the 'WARN' severity level.
   * @param msg - The message to be logged.
   * @returns A Message object with the specified message, severity level set to 'WARN', and the current context.
   */
  warn(...msg: any[]) {
    return new Message(...msg).is('WARN').context(this.context)
  }

  /**
   * @method error
   * Logs a message with the 'ERROR' severity level.
   * @param msg - The message to be logged.
   * @returns A Message object with the specified message, severity level set to 'ERROR', and the current context.
   */
  error(...msg: any[]) {
    return new Message(...msg).is('ERROR').context(this.context)
  }
}
