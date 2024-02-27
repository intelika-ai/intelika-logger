"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const consoleEmitter = (level, context, ...msg) => {
    const nestLogger = new common_1.Logger(context);
    const msgFormatted = msg.map(m => (typeof m === 'object' ? JSON.stringify(m) : m.toString())).join(' ');
    nestLogger[level.toLowerCase().replace('info', 'log')](msgFormatted);
};
exports.default = consoleEmitter;
//# sourceMappingURL=console.emitter.js.map