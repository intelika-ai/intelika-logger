import { Options } from './interfaces/option.interface';
export declare const options: Options;
/**
 * Sets the options for the logger.
 * @param opts - The options to be set.
 */
export declare function setOptions(opts: Options): void;
/**
 * Retrieves the options for logging.
 * @returns The options for logging.
 */
export declare const getOptions: () => Options;
