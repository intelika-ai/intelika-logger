/**
 * @interface
 * Represents a set of options for configuring the logger service.
 * @property discordWebhook - The Discord webhook URL.
 * @property telegram - The options for the Telegram bot.
 * @property context - The context for the logger service.
 *
 * @example
 * const options: Options = {
 * discordWebhook: 'https://discord.com/api/webhooks/...',
 * telegram: {
 * token: '...',
 * chatId: '123456789'
 * },
 * context: 'MyContext'
 */
export interface OptionsWithContext extends Omit<Options, 'isGlobal'> {
    context: string;
}
/**
 * Options for the logger.
 * @property isGlobal - Whether the module is global.
 * @property discordWebhook - The Discord webhook URL.
 * @property telegram - Options for the Telegram bot.
 * @example
 * const opts: Options = {
 * isGlobal: false,
 * discordWebhook: 'https://discord.com/api/webhooks/...',
 * telegram: {
 * token: '...',
 * chatId: '123456789'
 * }
 */
export interface Options {
    /**
     * Whether the module is global.
     * @default false
     */
    isGlobal?: boolean;
    /**
     * The Discord webhook URL.
     * @default undefined
     * @example 'https://discord.com/api/webhooks/...'
     */
    discordWebhook?: string;
    /**
     * Options for the Telegram bot.
     * @property token - The token for the Telegram bot.
     * @property chatId - The chat ID for the Telegram bot.
     * @default undefined
     * @example {
     *  token: '
     * chatId: '123456789'
     * }
     */
    telegram?: {
        token: string;
        chatId: string;
    };
}
/**
 * Represents the options for asynchronous operations.
 */
export interface AsyncOptions extends Options {
    /**
     * A factory function that returns a promise or an instance of Options.
     */
    useFactory?: (...args: any[]) => Promise<Options> | Options;
    /**
     * An array of dependencies to be injected into the factory function.
     */
    inject?: any[];
}
export interface AsyncOptions extends Options {
    useFactory?: (...args: any[]) => Promise<Options> | Options;
    inject?: any[];
}
