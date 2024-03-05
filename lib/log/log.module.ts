import { Module, DynamicModule } from '@nestjs/common'
import { LogService } from './log.service'
import 'reflect-metadata'
import { setOptions } from './options'
import { Options } from './interfaces/option.interface'
import { AsyncOptions } from './interfaces/asyncOptions.interface'

@Module({
  providers: [LogService],
  exports: [LogService]
})
/**
 * @class LogModule
 * Represents a module for logging functionality.
 */
export class LogModule {
  /**
   * @method forRoot
   * Creates a dynamic module for the LogModule.
   * @param opts - The options for configuring the LogModule.
   * @returns A dynamic module configuration object.
   */
  static forRoot(opts: Options): DynamicModule {
    setOptions(opts)
    return {
      global: opts.isGlobal,
      module: LogModule,
      exports: [LogService]
    }
  }

  /**
   * @method forRootAsync
   * Creates a dynamic module for configuring the logger service asynchronously.
   * @param opt - The options for configuring the logger service.
   * @returns A dynamic module with the configured logger service.
   */
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
