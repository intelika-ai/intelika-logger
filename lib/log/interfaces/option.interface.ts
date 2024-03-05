/**
 * @interface Options
 * Represents a set of options for configuring the logger service.
 * @property discordWebhook - The Discord webhook URL.
 * @property telegram - The options for the Telegram bot.
 * @property context - The context for the logger service.
 * @property isGlobal - Whether the module is global.
 * @example
 * const options: Options = {
 * discordWebhook: 'https://discord.com/api/webhooks/...',
 * telegram: {
 * token: '...',
 * chatId: '123456789'
 * },
 * isGlobal: true,
 * }
 */

export interface Options {
  /**
   * Whether the module is global.
   * @default false
   */
  isGlobal?: boolean

  /**
   * The Discord webhook URL.
   * @default undefined
   * @example 'https://discord.com/api/webhooks/...'
   */
  discordWebhook?: string
  /**
   * Options for the Telegram bot.
   * @property token - The token for the Telegram bot.
   * @property chatId - The chat ID for the Telegram bot.
   * @default undefined
   * @example { token: '..', chatId: '123456789' }
   */
  telegram?: {
    token: string
    chatId: string
  }
}
