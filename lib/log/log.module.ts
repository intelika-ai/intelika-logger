import { Module, DynamicModule } from '@nestjs/common'
import { LogService } from './log.service'
import 'reflect-metadata'
export interface Options {
  isGlobal?: boolean
  discordWebhook?: string
  telegram?: {
    token: string
    chatId: string
  }
}

interface AsyncOptions extends Options {
  useFactory?: (...args: any[]) => Promise<Options> | Options
  inject?: any[]
}

export let options: Options = {}

@Module({
  providers: [LogService],
  exports: [LogService]
})
export class LogModule {
  static forRoot(opts: Options): DynamicModule {
    options = opts
    return {
      global: opts.isGlobal,
      module: LogModule,
      exports: [LogService]
    }
  }

  static forRootAsync(opt: AsyncOptions): DynamicModule {
    return {
      global: opt.isGlobal,
      module: LogModule,
      providers: [
        {
          inject: opt.inject,
          provide: 'OPTIONS',
          useFactory: (...args: any[]) => {
            if (opt.useFactory) {
              const returnType = Reflect.getMetadata('design:returntype', opt.useFactory)

              if (returnType !== Promise) {
                options = opt.useFactory(...args) as Options
              } else {
                ;(opt.useFactory(...args) as Promise<AsyncOptions>).then((opts: Options) => {
                  options = opts
                })
              }
            }
            return opt
          }
        },
        LogService
      ],
      exports: [LogService]
    }
  }
}

export const getOptions = () => options
