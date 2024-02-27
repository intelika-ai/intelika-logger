"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.setOptions = exports.options = void 0;
exports.options = {};
/**
 * Sets the options for the logger.
 * @param opts - The options to be set.
 */
function setOptions(opts) {
    Object.assign(exports.options, opts);
}
exports.setOptions = setOptions;
/**
 * Retrieves the options for logging.
 * @returns The options for logging.
 */
const getOptions = () => exports.options;
exports.getOptions = getOptions;
//# sourceMappingURL=options.js.map