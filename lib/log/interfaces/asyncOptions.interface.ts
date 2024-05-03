import { NestOptions, Options } from './option.interface'

/**
 * @interface AsyncOptions
 * Represents a set of options for configuring the logger service asynchronously.
 * @property useFactory - The factory for creating the options.
 * @property inject - The dependencies to inject into the factory.
 * @example
 * const asyncOptions: AsyncOptions = {
 *  useFactory: async () => {
 *    return {
 *          discordWebhook: 'https://discord.com/api/webhooks/...',
 *          telegram: { token: '...', chatId: '123456789' },
 *          isGlobal: true
 *       }
 *  },
 *  inject: []
 * }
 */

export interface AsyncOptions extends NestOptions {
  useFactory?: (...args: any[]) => Promise<Options> | Options

  inject?: any[]
}
