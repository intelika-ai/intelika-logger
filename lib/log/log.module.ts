import { Module, DynamicModule, Provider } from '@nestjs/common'
import { LogService } from './log.service'
import 'reflect-metadata'
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
    const logServiceProvider: Provider = {
      provide: LogService,
      useFactory: () => {
        return new LogService({
          context: '',
          ...opts
        })
      }
    }

    return {
      global: opts.isGlobal,
      module: LogModule,
      providers: [logServiceProvider],
      exports: [logServiceProvider]
    }
  }

  static forRootAsync(opt: AsyncOptions): DynamicModule {
    let factoryItem
    if (opt.useFactory) {
      const returnType = Reflect.getMetadata('design:returntype', opt.useFactory)
      if (returnType === Promise) {
        factoryItem = async (...args: any[]) => {
          const options = await opt.useFactory(...args)
          return new LogService({
            ...options,
            context: ''
          })
        }
      } else {
        factoryItem = (...args: any[]) => {
          const options = opt.useFactory(...args)
          return new LogService({
            ...options,
            context: ''
          })
        }
      }
    }
    const logServiceProvider: Provider = {
      provide: LogService,
      useFactory: factoryItem,
      inject: opt.inject
    }

    return {
      global: opt.isGlobal,
      module: LogModule,
      providers: [logServiceProvider],
      exports: [logServiceProvider]
    }
  }
}
