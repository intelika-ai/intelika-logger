"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = exports.Emitter = void 0;
const console_emitter_1 = require("./emitters/console.emitter");
const discord_emitter_1 = require("./emitters/discord.emitter");
const telegram_emitter_1 = require("./emitters/telegram.emitter");
const options_1 = require("./options");
/**
 * @enum Emitter
 * Enum representing different emitters for logging.
 * @example
 * const emitter = Emitter.DISCORD
 */
var Emitter;
(function (Emitter) {
    Emitter["DISCORD"] = "DISCORD";
    Emitter["TELEGRAM"] = "TELEGRAM";
    Emitter["CONSOLE"] = "CONSOLE";
})(Emitter || (exports.Emitter = Emitter = {}));
class Message {
    constructor(...msg) {
        this.level = 'INFO';
        this.msg = [];
        this.msg = msg;
    }
    context(context) {
        this._context = context;
        return this;
    }
    is(level) {
        this.level = level;
        return this;
    }
    into(emitter) {
        const emitters = {
            CONSOLE: console_emitter_1.default,
            DISCORD: discord_emitter_1.default,
            TELEGRAM: telegram_emitter_1.default
        };
        const emitterFunc = emitters[emitter];
        if (!emitterFunc) {
            throw new Error('Invalid emitter');
        }
        emitterFunc(this.level, this._context, ...this.msg);
        return this;
    }
}
/**
 * @class LogService
 * Represents a logging service that provides methods for logging messages with different severity levels.
 * @example
 * const logger = new LogService('MyContext')
 * logger.log('This is an info message').into(Emitter.CONSOLE)
 */
class LogService {
    /**
     * Creates a new instance of the LogService.
     * @constructor
     * @param { string | OptionsWithContext } context - The context for the logger service.
     * @example
     * const logger = new LogService('MyContext')
     * logger.log('This is an info message').into(Emitter.CONSOLE)
     */
    constructor(context) {
        if (typeof context === 'string') {
            this.context = context;
        }
        else {
            this.context = context.context || '';
            (0, options_1.setOptions)(context);
        }
    }
    /**
     * @method log
     * Logs a message with the 'INFO' severity level.
     * @param msg - The message to be logged.
     * @returns A Message object with the specified message, severity level set to 'INFO', and the current context.
     */
    log(...msg) {
        return new Message(...msg).is('INFO').context(this.context);
    }
    /**
     * @method warn
     * Logs a message with the 'WARN' severity level.
     * @param msg - The message to be logged.
     * @returns A Message object with the specified message, severity level set to 'WARN', and the current context.
     */
    warn(...msg) {
        return new Message(...msg).is('WARN').context(this.context);
    }
    /**
     * @method error
     * Logs a message with the 'ERROR' severity level.
     * @param msg - The message to be logged.
     * @returns A Message object with the specified message, severity level set to 'ERROR', and the current context.
     */
    error(...msg) {
        return new Message(...msg).is('ERROR').context(this.context);
    }
}
exports.LogService = LogService;
//# sourceMappingURL=log.service.js.map