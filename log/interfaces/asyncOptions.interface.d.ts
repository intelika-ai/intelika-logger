import { Options } from './option.interface';
/**
 * @interface AsyncOptions
 * Represents a set of options for configuring the logger service asynchronously.
 * @property useFactory - A factory function that returns a promise or an instance of Options.
 * @property inject - An array of dependencies to be injected into the factory function.
 *  @example
*  @Module({
    imports: [ LogModule.forRootAsync({}) ]
})
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
