import { Options } from './interfaces/option.interface'

export const options: Options = {}

/**
 * Sets the options for the logger.
 * @param opts - The options to be set.
 */
export function setOptions(opts: Options) {
  Object.assign(options, opts)
}

/**
 * Retrieves the options for logging.
 * @returns The options for logging.
 */
export const getOptions = () => options
