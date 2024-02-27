import { OptionsWithContext } from './interfaces/options-Context.interface';
type LogLevel = 'WARN' | 'INFO' | 'ERROR';
/**
 * @enum Emitter
 * Enum representing different emitters for logging.
 * @example
 * const emitter = Emitter.DISCORD
 */
export declare enum Emitter {
    'DISCORD' = "DISCORD",
    'TELEGRAM' = "TELEGRAM",
    'CONSOLE' = "CONSOLE"
}
declare class Message {
    private level;
    private msg;
    private _context;
    constructor(...msg: any[]);
    context(context: string): this;
    is(level: LogLevel): this;
    into(emitter: Emitter): this;
}
/**
 * @class LogService
 * Represents a logging service that provides methods for logging messages with different severity levels.
 * @example
 * const logger = new LogService('MyContext')
 * logger.log('This is an info message').into(Emitter.CONSOLE)
 */
export declare class LogService {
    private context;
    /**
     * Creates a new instance of the LogService.
     * @constructor
     * @param { string | OptionsWithContext } context - The context for the logger service.
     * @example
     * const logger = new LogService('MyContext')
     * logger.log('This is an info message').into(Emitter.CONSOLE)
     */
    constructor(context: string | OptionsWithContext);
    /**
     * @method log
     * Logs a message with the 'INFO' severity level.
     * @param msg - The message to be logged.
     * @returns A Message object with the specified message, severity level set to 'INFO', and the current context.
     */
    log(...msg: any[]): Message;
    /**
     * @method warn
     * Logs a message with the 'WARN' severity level.
     * @param msg - The message to be logged.
     * @returns A Message object with the specified message, severity level set to 'WARN', and the current context.
     */
    warn(...msg: any[]): Message;
    /**
     * @method error
     * Logs a message with the 'ERROR' severity level.
     * @param msg - The message to be logged.
     * @returns A Message object with the specified message, severity level set to 'ERROR', and the current context.
     */
    error(...msg: any[]): Message;
}
export {};
