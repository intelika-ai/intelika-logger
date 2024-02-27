"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LogModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogModule = void 0;
const common_1 = require("@nestjs/common");
const log_service_1 = require("./log.service");
require("reflect-metadata");
const options_1 = require("./options");
let LogModule = LogModule_1 = class LogModule {
    /**
     * @method forRoot
     * Creates a dynamic module for the LogModule.
     * @param opts - The options for configuring the LogModule.
     * @returns A dynamic module configuration object.
     */
    static forRoot(opts) {
        (0, options_1.setOptions)(opts);
        return {
            global: opts.isGlobal,
            module: LogModule_1,
            exports: [log_service_1.LogService]
        };
    }
    /**
     * @method forRootAsync
     * Creates a dynamic module for configuring the logger service asynchronously.
     * @param opt - The options for configuring the logger service.
     * @returns A dynamic module with the configured logger service.
     */
    static forRootAsync(opt) {
        return {
            global: opt.isGlobal,
            module: LogModule_1,
            providers: [
                {
                    inject: opt.inject,
                    provide: 'OPTIONS',
                    useFactory: (...args) => {
                        if (opt.useFactory) {
                            const returnType = Reflect.getMetadata('design:returntype', opt.useFactory);
                            if (returnType !== Promise) {
                                (0, options_1.setOptions)(opt.useFactory(...args));
                            }
                            else {
                                ;
                                opt.useFactory(...args).then((opts) => {
                                    (0, options_1.setOptions)(opts);
                                });
                            }
                        }
                        return opt;
                    }
                },
                log_service_1.LogService
            ],
            exports: [log_service_1.LogService]
        };
    }
};
exports.LogModule = LogModule;
exports.LogModule = LogModule = LogModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [log_service_1.LogService],
        exports: [log_service_1.LogService]
    })
    /**
     * @class LogModule
     * Represents a module for logging functionality.
     */
], LogModule);
//# sourceMappingURL=log.module.js.map