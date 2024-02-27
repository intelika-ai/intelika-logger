import { DynamicModule } from '@nestjs/common';
import 'reflect-metadata';
import { Options } from './interfaces/option.interface';
import { AsyncOptions } from './interfaces/asyncOptions.interface';
export declare class LogModule {
    /**
     * @method forRoot
     * Creates a dynamic module for the LogModule.
     * @param opts - The options for configuring the LogModule.
     * @returns A dynamic module configuration object.
     */
    static forRoot(opts: Options): DynamicModule;
    /**
     * @method forRootAsync
     * Creates a dynamic module for configuring the logger service asynchronously.
     * @param opt - The options for configuring the logger service.
     * @returns A dynamic module with the configured logger service.
     */
    static forRootAsync(opt: AsyncOptions): DynamicModule;
}
