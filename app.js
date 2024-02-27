"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const test_module_1 = require("./test.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(test_module_1.TestModule, {
        logger: ['error', 'warn', 'log', 'fatal', 'debug']
    });
}
//# sourceMappingURL=app.js.map