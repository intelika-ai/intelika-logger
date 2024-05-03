import { Options } from './interfaces/option.interface'
import { OptionsWithContext } from './interfaces/options-Context.interface'
import { Message } from './message'

/**
 * @enum Emitter
 * Enum representing different emitters for logging.
 * @example
 * const emitter = Emitter.DISCORD
 */
export enum Emitter {
  'DISCORD' = 'DISCORD',
  'TELEGRAM' = 'TELEGRAM',
  'CONSOLE' = 'CONSOLE',
  'FILE' = 'FILE'
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
  private options: Options
  /**
   * Creates a new instance of the LogService.
   * @constructor
   * @param { string | OptionsWithContext } context - The context for the logger service.
   * @example
   * const logger = new LogService('MyContext')
   * logger.log('This is an info message').into(Emitter.CONSOLE)
   */
  constructor(context: string, options?: Options)
  constructor(context: OptionsWithContext)
  constructor(context: string | OptionsWithContext, options?: Options) {
    if (typeof context === 'string') {
      this.context = context
      if (options) {
        this.options = options
      }
    } else if (typeof context === 'object') {
      this.context = context.context
      this.options = context
    } else {
      throw new Error('Invalid context')
    }
  }

  /**
   * @method log
   * Logs a message with the 'INFO' severity level.
   * @param msg - The message to be logged.
   * @returns A Message object with the specified message, severity level set to 'INFO', and the current context.
   */
  log(...msg: any[]) {
    return new Message(this.options, ...msg).is('INFO').context(this.context)
  }

  /**
   * @method warn
   * Logs a message with the 'WARN' severity level.
   * @param msg - The message to be logged.
   * @returns A Message object with the specified message, severity level set to 'WARN', and the current context.
   */
  warn(...msg: any[]) {
    return new Message(this.options, ...msg).is('WARN').context(this.context)
  }

  /**
   * @method error
   * Logs a message with the 'ERROR' severity level.
   * @param msg - The message to be logged.
   * @returns A Message object with the specified message, severity level set to 'ERROR', and the current context.
   */
  error(...msg: any[]) {
    return new Message(this.options, ...msg).is('ERROR').context(this.context)
  }
}
