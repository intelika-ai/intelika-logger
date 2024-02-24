import { Module, DynamicModule } from '@nestjs/common'
import { LogService } from './log.service'
import 'reflect-metadata'
import { AsyncOptions, Options, setOptions } from './options'

@Module({
  providers: [LogService],
  exports: [LogService]
})
export class LogModule {
  static forRoot(opts: Options): DynamicModule {
    setOptions(opts)
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
                setOptions(opt.useFactory(...args) as Options)
              } else {
                ;(opt.useFactory(...args) as Promise<AsyncOptions>).then((opts: Options) => {
                  setOptions(opts)
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
