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

  /**
   * Options for the file emitter.
   * @property path - The path for the file or directory.
   * @property includeDateInFilename - Whether to include the date in the filename. [when path is a directory]
   * @property fileFormat - The format of the file. [txt | log]
   * @property flags - The flags for writing to the file. [a | w | r | a+ | w+ | r+]
   * @property messageFormat - The format of the message. [DATE | LEVEL | CONTEXT | MESSAGE]
   * @default undefined
   * @example { path: './logs', includeDateInFilename: true, fileFormat: 'log', messageFormat: 'DATE - LEVEL | CONTEXT | MESSAGE' }
   */
  file?: {
    path: string // can be a file path or a directory path
    includeDateInFilename?: boolean
    fileFormat?: 'txt' | 'log'
    flags?: string // 'a' | 'w' | 'r' | 'a+' | 'w+' | 'r+'
    messageFormat?:
      | 'DATE | LEVEL | CONTEXT | MESSAGE'
      | 'DATE - LEVEL | CONTEXT | MESSAGE'
      | 'DATE | CONTEXT | MESSAGE'
      | 'DATE - CONTEXT | MESSAGE'
      | 'DATE | MESSAGE'
      | 'DATE - MESSAGE'
  }
}

/**
 * @interface NestOptions
 * Represents a set of options for configuring the logger service.
 * @property isGlobal - Whether the module is global.
 * @default false
 */
export interface NestOptions extends Options {
  /**
   * Whether the module is global.
   * @default false
   */
  isGlobal?: boolean
}
