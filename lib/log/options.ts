export interface Options {
  isGlobal?: boolean
  discordWebhook?: string
  telegram?: {
    token: string
    chatId: string
  }
}

export interface AsyncOptions extends Options {
  useFactory?: (...args: any[]) => Promise<Options> | Options
  inject?: any[]
}

export const options: Options = {}

export function setOptions(opts: Options) {
  Object.assign(options, opts)
}

export const getOptions = () => options
